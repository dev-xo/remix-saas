import type { DataFunctionArgs } from '@remix-run/node'
import type { AuthSession } from '~/lib/auth/session.server'

import { json, redirect } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'
import { getSession, commitSession } from '~/lib/auth/session.server'
import { STRIPE_KEYS } from '~/lib/constants'
import {
	retrieveStripeSubscription,
	updateStripeSubscription,
} from '~/lib/stripe/utils'

export async function action({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// On `subscriptionId`, updates Session accordingly.
	if (user.subscription?.subscriptionId) {
		const subscriptionId = user.subscription?.subscriptionId
		const subscription = await retrieveStripeSubscription(subscriptionId)

		if (subscription && subscription?.status === 'active') {
			// Gets values from `formData`.
			const formData = await request.formData()
			const { newPlanId } = Object.fromEntries(formData)

			if (typeof newPlanId === 'string') {
				// Updates current subscription plan.
				// Info about Proration:
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

				session.flash(STRIPE_KEYS.HAS_SUCCESSFULLY_UPDATED_PLAN, true)

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

export default function UpdateSubscriptionResource() {
	return <div>Whops! You should have been redirected.</div>
}
