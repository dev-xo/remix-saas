import type { ActionFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect, json } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { retrieveStripeSubscription } from '~/modules/stripe/queries'
import { updateStripeSubscription } from '~/modules/stripe/mutations'

/**
 * Remix - Action.
 * @protected Template code.
 *
 * Upgrades or Downgrades current Subscription Plan.
 */
export const action: ActionFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as AuthSession | null

	if (user && user.subscription[0]?.subscriptionId) {
		const subscriptionId = user.subscription[0]?.subscriptionId
		const subscription = await retrieveStripeSubscription(subscriptionId)

		if (subscription?.status === 'active') {
			/**
			 * Gets values from `formData`.
			 */
			const formData = await request.formData()
			const { newPlanId } = Object.fromEntries(formData)

			if (typeof newPlanId === 'string') {
				/**
				 * Updates current Subscription Plan.
				 * More info about Proration:
				 * https://stripe.com/docs/billing/subscriptions/upgrade-downgrade#changing
				 */
				await updateStripeSubscription(subscriptionId, {
					proration_behavior: 'always_invoice',
					items: [
						{
							id: subscription.items.data[0].id,
							price: newPlanId,
						},
					],
				})

				/**
				 * On success:
				 * - Parses a Cookie and returns the associated Session.
				 * - Updates Auth Session accordingly.
				 * - Commits the session and redirects with newly updated headers.
				 */
				let session = await getSession(request.headers.get('Cookie'))

				session.set(authenticator.sessionKey, {
					...user,
					subscription: [{ ...user.subscription[0], planId: newPlanId }],
				} as AuthSession)

				/**
				 * Sets a value in the session that is only valid until the next session.get().
				 */
				session.flash('HAS_SUCCESSFULLY_UPDATED_PLAN', true)

				return redirect('/account', {
					headers: {
						'Set-Cookie': await commitSession(session),
					},
				})
			}
		}
	}

	/**
	 * Whops!
	 */
	return json({}, { status: 400 })
}
