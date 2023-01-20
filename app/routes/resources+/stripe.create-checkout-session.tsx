import type { DataFunctionArgs } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getUserById } from '~/models/user/get-user'
import { createSubscription } from '~/models/subscription/create-subscription'
import { createStripeCheckoutSession } from '~/services/stripe/api/create-stripe-checkout-session'
import { createStripeCustomer } from '~/services/stripe/api/create-stripe-customer'

export async function action({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Gets values from `formData`.
	const { checkoutPlanId } = Object.fromEntries(await request.formData())

	// Early exit if user selected a FREE plan.
	if (!checkoutPlanId || typeof checkoutPlanId !== 'string')
		return redirect('/admin')

	// On `customerId` in Session:
	if (user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCheckoutSession(
			customerId,
			checkoutPlanId,
			request,
		)

		// Redirects to checkout with Customer already set.
		return redirect(stripeRedirectUrl)
	}

	// On `customerId` not in Session:
	if (!user.subscription?.customerId) {
		// Checks for user existence in database.
		const dbUser = await getUserById(user.id, {
			subscription: true,
		})

		// On `customerId` found in database:
		if (dbUser && dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			const stripeRedirectUrl = await createStripeCheckoutSession(
				customerId,
				checkoutPlanId,
				request,
			)

			// Redirects to checkout with Customer already set.
			return redirect(stripeRedirectUrl)
		}

		// On `customerId` not found in database:
		if (dbUser && !dbUser.subscription?.customerId) {
			// Creates a new Stripe Customer.
			const newStripeCustomer = await createStripeCustomer({
				email: user.email ? user.email : '',
				name: user.name ? user.name : undefined,
			})
			if (!newStripeCustomer)
				throw new Error('There was an Error trying to create a new Stripe Customer.')

			// Stores newly created Customer into database.
			const newSubscription = await createSubscription({
				userId: user.id,
				customerId: newStripeCustomer.id,
				subscriptionId: null,
				planId: null,
				status: null,
				currentPeriodStart: null,
				currentPeriodEnd: null,
				cancelAtPeriodEnd: null,
			})
			if (!newSubscription)
				throw new Error('There was an Error trying to create a new Subscription.')

			const customerId = newStripeCustomer.id
			const stripeRedirectUrl = await createStripeCheckoutSession(
				customerId,
				checkoutPlanId,
				request,
			)

			// Redirects to checkout with Customer already set.
			return redirect(stripeRedirectUrl)
		}
	}

	// Whops!
	return json({}, { status: 400 })
}

export default function CreateCheckoutSessionResource() {
	return <div>Whops! You should have been redirected.</div>
}
