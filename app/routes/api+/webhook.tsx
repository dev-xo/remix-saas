import type { DataFunctionArgs } from '@remix-run/node'
import type Stripe from 'stripe'

import { json } from '@remix-run/node'
import { stripe } from '~/services/stripe/config.server'
import { retrieveStripeSubscription } from '~/services/stripe/api/retrieve-stripe-subscription'
import { getSubscriptionByCustomerId } from '~/models/subscription/get-subscription'
import { updateSubscription } from '~/models/subscription/update-subscription'

export async function action({ request }: DataFunctionArgs) {
	let event = undefined

	const payload = await request.text()
	const signature = request.headers.get('stripe-signature')

	try {
		if (typeof signature === 'string') {
			// Constructs and verifies the signature of an Event.
			event = stripe.webhooks.constructEvent(
				payload,
				signature,
				process.env.NODE_ENV === 'development'
					? process.env.DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET
					: process.env.PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET,
			) as Stripe.DiscriminatedEvent
		}
	} catch (err: unknown) {
		console.log(err)
		return json({}, { status: 500 })
	}

	switch (event?.type) {
		// This event occurs when a Checkout Session
		// has been successfully completed.
		case 'checkout.session.completed': {
			const session = event.data.object
			const customerId = session.customer
			const subscriptionId = session.subscription

			if (session.payment_status === 'paid') {
				if (typeof customerId !== 'string' || typeof subscriptionId !== 'string')
					return json({}, { status: 500 })

				const subscription = await retrieveStripeSubscription({ subscriptionId })

				if (subscription) {
					const planId = subscription.items.data[0].plan.id
					const status = subscription.status
					const currentPeriodStart = subscription.current_period_start
					const currentPeriodEnd = subscription.current_period_end
					const cancelAtPeriodEnd = subscription.cancel_at_period_end

					await updateSubscription({
						customerId,
						subscription: {
							planId,
							status,
							currentPeriodStart,
							currentPeriodEnd,
							cancelAtPeriodEnd,
						},
					})
				}
			}

			return json({}, { status: 200 })
		}

		// This event occurs whenever a subscription changes.
		// (E.G: Switching plans, or changing the status from trial to active).
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
				await updateSubscription({
					customerId,
					subscription: {
						subscriptionId,
						planId,
						status,
						currentPeriodStart,
						currentPeriodEnd,
						cancelAtPeriodEnd,
					},
				})
			}

			return json({}, { status: 200 })
		}

		// Occurs whenever a customer’s subscription ends.
		// Cleans up Subscription Model.
		case 'customer.subscription.deleted': {
			const subscription = event.data.object
			const customerId = subscription.customer

			if (typeof customerId === 'string') {
				const dbSubscription = await getSubscriptionByCustomerId({ customerId })
				if (!dbSubscription?.customerId) return json({}, { status: 404 })

				await updateSubscription({
					customerId,
					subscription: {
						subscriptionId: null,
						planId: null,
						status: null,
						currentPeriodStart: null,
						currentPeriodEnd: null,
						cancelAtPeriodEnd: null,
					},
				})
			}

			return json({}, { status: 200 })
		}
	}

	// Possible status returns: 200 | 404.
	return json({}, { status: 200 })
}

export default function WebhookResource() {
	return <div>Whops! You should have been redirected.</div>
}
