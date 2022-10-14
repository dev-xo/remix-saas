import type { ActionFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/modules/auth'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'
import { createStripeCustomer } from '~/modules/stripe/mutations'
import { createSubscription } from '~/modules/subscription/mutations'
import { createStripeCheckoutSession } from '~/modules/stripe/utils'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request)

	// Gets values from `formData`.
	const formData = await request.formData()
	const { planId } = Object.fromEntries(formData)

	// Checks for Subscription Customer into Auth Session.
	// On success: Redirects to checkout with Customer already set.
	if (user && user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCheckoutSession(
			customerId,
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Checks for Subscription Customer into database.
	// On success: Redirects to checkout with Customer already set.
	if (user && !user.subscription) {
		const dbUser = await getUserByProviderIdIncludingSubscription(
			user.providerId,
		)

		if (dbUser && dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			const stripeRedirectUrl = await createStripeCheckoutSession(
				customerId,
				planId as string,
			)

			if (typeof stripeRedirectUrl === 'string')
				return redirect(stripeRedirectUrl)
		}
	}

	// If Subscription Customer has not been found in any of the previous checks:
	// - Creates a new Stripe Customer.
	// - Stores newly created Stripe Customer into database.
	// - Redirects to checkout with Customer already set.
	if (user && !user.subscription) {
		const newStripeCustomer = await createStripeCustomer({
			email: user.email,
			name: user.name ? user.name : undefined,
		})
		if (!newStripeCustomer)
			throw new Error(
				'There was an Error trying to create a new Stripe Customer.',
			)

		const newSubscription = await createSubscription({
			providerId: user.providerId,
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
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Whops!
	return json({}, { status: 400 })
}
