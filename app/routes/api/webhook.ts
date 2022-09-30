/// <reference types="stripe-event-types" />

import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { updateSubscription } from '~/modules/subscription/mutations'
import { retrieveStripeSubscription } from '~/modules/stripe/queries'
import { getSubscriptionCustomerById } from '~/modules/subscription/queries'
import Stripe from 'stripe'

/**
 * Init Environment.
 */
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

const WEBHOOK_ENDPOINT_SECRET =
	process.env.NODE_ENV === 'development'
		? process.env.DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET
		: process.env.PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

/**
 * Remix - Action.
 * @protected Template code.
 */
export const action: ActionFunction = async ({ request }) => {
	const payload = await request.text()
	const signature = request.headers.get('stripe-signature')

	let event = undefined

	try {
		/**
		 * Constructs and verifies the signature of an Event.
		 */
		if (typeof signature === 'string') {
			event = stripe.webhooks.constructEvent(
				payload,
				signature,
				WEBHOOK_ENDPOINT_SECRET,
			) as Stripe.DiscriminatedEvent
		}
	} catch (err: unknown) {
		console.log(err)
		return json({}, { status: 500 })
	}

	/**
	 * Webhook Events.
	 */
	switch (event?.type) {
		/**
		 * This event occurs when a Checkout Session
		 * has been successfully completed.
		 *
		 * Initializes Subscription Model
		 * based on the object received from the Event.
		 */
		case 'checkout.session.completed': {
			const session = event.data.object
			const customerId = session.customer
			const subscriptionId = session.subscription

			if (
				session.payment_status === 'paid' &&
				typeof customerId === 'string' &&
				typeof subscriptionId === 'string'
			) {
				/**
				 * Retrieves newly created Stripe Subscription.
				 */
				const subscription = await retrieveStripeSubscription(subscriptionId)

				if (subscription) {
					const planId = subscription.items.data[0].plan.id
					const status = subscription.status
					const currentPeriodStart = subscription.current_period_start
					const currentPeriodEnd = subscription.current_period_end
					const cancelAtPeriodEnd = subscription.cancel_at_period_end

					await updateSubscription(customerId, {
						subscriptionId,
						planId,
						status,
						currentPeriodStart,
						currentPeriodEnd,
						cancelAtPeriodEnd,
					})
				}
			}

			return json({}, { status: 200 })
		}

		/**
		 * This event occurs whenever a subscription changes.
		 * (E.G: Switching plans, or changing
		 * the status from trial to active).
		 *
		 * Updates Subscription Model
		 * based on the object received from the Event.
		 */
		case 'customer.subscription.updated': {
			const subscription = event.data.object

			const customerId = subscription.customer
			const subscriptionId = subscription.id
			const planId = subscription.items.data[0].plan.id
			const status = subscription.status
			const currentPeriodStart = subscription.current_period_start
			const currentPeriodEnd = subscription.current_period_end
			const cancelAtPeriodEnd = subscription.cancel_at_period_end

			if (typeof customerId === 'string') {
				await updateSubscription(customerId, {
					subscriptionId,
					planId,
					status,
					currentPeriodStart,
					currentPeriodEnd,
					cancelAtPeriodEnd,
				})
			}

			return json({}, { status: 200 })
		}

		/**
		 * Occurs whenever a customer’s subscription ends.
		 * Cleans up Subscription Model.
		 */
		case 'customer.subscription.deleted': {
			const subscription = event.data.object
			const customerId = subscription.customer

			if (typeof customerId === 'string') {
				/**
				 * Checks for Customer existence into database.
				 * On failure: Update will be skiped.
				 */
				const dbCustomerId = await getSubscriptionCustomerById(customerId)
				if (!dbCustomerId?.customerId) return json({}, { status: 200 })

				await updateSubscription(customerId, {
					subscriptionId: null,
					planId: null,
					status: null,
					currentPeriodStart: null,
					currentPeriodEnd: null,
					cancelAtPeriodEnd: null,
				})
			}

			return json({}, { status: 200 })
		}
	}

	/**
	 * Possible status returns: 200 | 404
	 * No reason to throw an Error, we are just handling 'x' Events.
	 */
	return json({}, { status: 200 })
}
