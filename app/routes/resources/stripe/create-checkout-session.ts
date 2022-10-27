import type { ActionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getUserByIdIncludingSubscription } from '~/models/user.server'
import { createSubscription } from '~/models/subscription.server'
import {
	createStripeCustomer,
	createStripeCheckoutSession,
} from '~/services/stripe/utils.server'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action = async ({ request }: ActionArgs) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Gets values from `formData`.
	const formData = await request.formData()
	const { planId } = Object.fromEntries(formData)

	// Checks for Subscription Customer into Auth Session.
	// On success: Redirects to checkout with Customer already set.
	if (user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCheckoutSession(
			request,
			customerId,
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Checks for Subscription Customer into database.
	// On success: Redirects to checkout with Customer already set.
	if (!user.subscription?.customerId) {
		const dbUser = await getUserByIdIncludingSubscription(user.id)

		if (dbUser && dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			const stripeRedirectUrl = await createStripeCheckoutSession(
				request,
				customerId,
				planId as string,
			)

			if (typeof stripeRedirectUrl === 'string')
				return redirect(stripeRedirectUrl)
		}

		// If Subscription Customer has not been found in any of the previous checks:
		// - Creates a new Stripe Customer.
		// - Stores newly created Stripe Customer into database.
		// - Redirects to checkout with Customer already set.
		const newStripeCustomer = await createStripeCustomer({
			email: user.email ? user.email : '',
			name: user.name ? user.name : undefined,
		})
		if (!newStripeCustomer)
			throw new Error(
				'There was an Error trying to create a new Stripe Customer.',
			)

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
			request,
			customerId,
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Whops!
	return json({}, { status: 400 })
}
