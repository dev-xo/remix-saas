import type { ActionFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/modules/auth'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'

import { createStripeCustomer } from '~/modules/stripe/mutations'
import { createSubscription } from '~/modules/subscription/mutations'
import { createStripeCheckoutSession } from '~/modules/stripe/utils'

/**
 * Remix - Action.
 * @protected Template code.
 *
 * Redirects to Stripe Checkout.
 *
 * Also, checks for Customer existence into Auth Session or Database,
 * avoiding duplication of Stripe Customer at creation time.
 */
export const action: ActionFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as Awaited<AuthSession> | null

	/**
	 * Gets values from `formData`.
	 */
	const formData = await request.formData()
	const { planId } = Object.fromEntries(formData)

	/**
	 * Checks for Customer into Auth Session.
	 * On success: Redirects to checkout with customer already set.
	 */
	if (user && user.subscription[0]?.customerId) {
		const customerId = user.subscription[0].customerId
		const stripeRedirectUrl = await createStripeCheckoutSession(
			customerId,
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	/**
	 * Checks for Customer into Database.
	 * On success: Redirects to checkout with customer already set.
	 */
	if (user && user.subscription.length === 0) {
		const dbUser = await getUserByProviderIdIncludingSubscription(
			user.providerId,
		)

		if (dbUser && dbUser.subscription[0]?.customerId) {
			const customerId = dbUser.subscription[0].customerId
			const stripeRedirectUrl = await createStripeCheckoutSession(
				customerId,
				planId as string,
			)

			if (typeof stripeRedirectUrl === 'string')
				return redirect(stripeRedirectUrl)
		}
	}

	/**
	 * If Customer has not been found in any of the previous checks:
	 * - Creates a new Stripe Customer.
	 * - Stores newly created Stripe Customer into Database.
	 * - On success: Redirects to checkout with customer already set.
	 */
	if (user && user.subscription.length === 0) {
		const newStripeCustomer = await createStripeCustomer({
			email: user.email,
			name: user.name ? user.name : undefined,
		})
		if (!newStripeCustomer)
			throw new Error('Unable to create a new Stripe Customer.')

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
			throw new Error('Unable to create a new Subscription.')

		const customerId = newStripeCustomer.id
		const stripeRedirectUrl = await createStripeCheckoutSession(
			customerId,
			planId as string,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	/**
	 * Whops!
	 */
	return json({}, { status: 400 })
}
