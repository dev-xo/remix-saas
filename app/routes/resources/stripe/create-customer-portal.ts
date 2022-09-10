import type { ActionFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/modules/auth'
import { createStripeCustomerPortalSession } from '~/modules/stripe/utils'

/**
 * Remix - Action.
 * @protected Template code.
 *
 * Redirects to Customer Portal.
 */
export const action: ActionFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as Awaited<AuthSession> | null

	/**
	 * Checks for Customer in Auth Session.
	 * On success: Redirects to Customer Portal.
	 */
	if (user && user.subscription[0]?.customerId) {
		const customerId = user.subscription[0].customerId
		const stripeRedirectUrl = await createStripeCustomerPortalSession(
			customerId,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	/**
	 * Whops!
	 */
	return json({}, { status: 400 })
}
