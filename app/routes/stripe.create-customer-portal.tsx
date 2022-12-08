import type { DataFunctionArgs } from '@remix-run/node'
import type { AuthSession } from '~/lib/auth/session.server'

import { json, redirect } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'
import { getSession, commitSession } from '~/lib/auth/session.server'
import { getUserById } from '~/lib/models/user'
import { createStripeCustomerPortalSession } from '~/lib/stripe/utils'

export async function loader({ request }: DataFunctionArgs) {
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

	// On `subscriptionId`, updates Session accordingly.
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

export async function action({ request }: DataFunctionArgs) {
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

		if (typeof stripeRedirectUrl === 'string') return redirect(stripeRedirectUrl)
	}

	// Whops!
	return json({}, { status: 400 })
}

export default function CreateCustomerPortalResource() {
	return <div>Whops! You should have been redirected.</div>
}
