import type { LoaderArgs, ActionArgs } from '@remix-run/node'
import type { AuthSession } from '~/services/auth/session.server'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserById } from '~/models/user.server'
import { createStripeCustomerPortalSession } from '~/services/stripe/utils.server'

/**
 * Remix - Loader.
 */
export async function loader({ request }: LoaderArgs) {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Checks for user existence in database.
	const dbUser = await getUserById({
		id: user.id,
		include: {
			subscription: true,
		},
	})

	// On `subscriptionId`, updates Auth Session accordingly.
	if (dbUser && dbUser.subscription?.subscriptionId) {
		let session = await getSession(request.headers.get('Cookie'))

		session.set(authenticator.sessionKey, {
			...user,
			subscription: { ...dbUser.subscription },
		} as AuthSession)

		return redirect('/account', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		})
	}

	// Whops!
	return redirect('/')
}

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// On `customerId`, redirects to Stripe Customer Portal.
	if (user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCustomerPortalSession(
			request,
			customerId,
		)

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl)
	}

	// Whops!
	return json({}, { status: 400 })
}
