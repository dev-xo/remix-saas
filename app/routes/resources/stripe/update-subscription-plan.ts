import type { ActionFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect, json } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { retrieveStripeSubscription } from '~/modules/stripe/queries'
import { updateStripeSubscription } from '~/modules/stripe/mutations'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request)

	// Checks for Subscription ID existence into Auth Session.
	if (user && user.subscription?.subscriptionId) {
		const subscriptionId = user.subscription?.subscriptionId
		const subscription = await retrieveStripeSubscription(subscriptionId)

		if (subscription && subscription?.status === 'active') {
			// Gets values from `formData`.
			const formData = await request.formData()
			const { newPlanId } = Object.fromEntries(formData)

			if (typeof newPlanId === 'string') {
				// Updates current Subscription Plan.
				// More info about Proration:
				// https://stripe.com/docs/billing/subscriptions/upgrade-downgrade#changing
				await updateStripeSubscription(subscriptionId, {
					proration_behavior: 'always_invoice',
					items: [
						{
							id: subscription.items.data[0].id,
							price: newPlanId,
						},
					],
				})

				// On Update Stripe Subscription success: Updates Auth Session accordingly.
				let session = await getSession(request.headers.get('Cookie'))

				session.set(authenticator.sessionKey, {
					...user,
					subscription: { ...user.subscription, planId: newPlanId },
				} as AuthSession)

				// Sets a value in the session that is only valid until the next session.get().
				// Used to enhance UI experience.
				session.flash('HAS_SUCCESSFULLY_UPDATED_PLAN', true)

				return redirect('/account', {
					headers: {
						'Set-Cookie': await commitSession(session),
					},
				})
			}
		}
	}

	// Whops!
	return json({}, { status: 400 })
}
