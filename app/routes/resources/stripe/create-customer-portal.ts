import type { ActionFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/modules/auth'
import { createStripeCustomerPortalSession } from '~/modules/stripe/utils'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request)

	// Checks for Subscription Customer in Auth Session.
	// On success: Redirects to Stripe Customer Portal.
	if (user && user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCustomerPortalSession(
			customerId,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Whops!
	return json({}, { status: 400 })
}
