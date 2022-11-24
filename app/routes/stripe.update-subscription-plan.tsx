import type { ActionArgs } from '@remix-run/node'
import type { AuthSession } from '~/services/auth/session.server'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

import {
	retrieveStripeSubscription,
	updateStripeSubscription,
} from '~/services/stripe/utils.server'

import { HAS_SUCCESSFULLY_UPDATED_PLAN } from '~/services/stripe/constants.server'

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// On `subscriptionId`, updates Auth Session accordingly.
	if (user.subscription?.subscriptionId) {
		const subscriptionId = user.subscription?.subscriptionId
		const subscription = await retrieveStripeSubscription(subscriptionId)

		if (subscription && subscription?.status === 'active') {
			// Gets values from `formData`.
			const formData = await request.formData()
			const { newPlanId } = Object.fromEntries(formData)

			if (typeof newPlanId === 'string') {
				// Updates current subscription plan.
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

				let session = await getSession(request.headers.get('Cookie'))

				session.set(authenticator.sessionKey, {
					...user,
					subscription: { ...user.subscription, planId: newPlanId },
				} as AuthSession)

				session.flash(HAS_SUCCESSFULLY_UPDATED_PLAN, true)

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
