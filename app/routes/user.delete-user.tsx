import type { ActionArgs } from '@remix-run/node'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'
import { getSession, destroySession } from '~/lib/auth/session.server'
import { getUserById, deleteUser } from '~/lib/models/user'
import { retrieveStripeCustomer, deleteStripeCustomer } from '~/lib/stripe/utils'

export const action = async ({ request }: ActionArgs) => {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	})

	// Checks for user existence in database.
	const dbUser = await getUserById({
		id: user.id,
		include: {
			subscription: true,
		},
	})

	if (dbUser) {
		const userId = dbUser.id
		const customerId = dbUser.subscription?.customerId

		// Deletes Stripe Customer.
		if (customerId) {
			const stripeCustomer = await retrieveStripeCustomer(customerId)
			if (stripeCustomer) await deleteStripeCustomer(customerId)
		}

		// Deletes user from database.
		await deleteUser(userId)

		// Redirects destroying current Session.
		let session = await getSession(request.headers.get('Cookie'))

		return redirect('/', {
			headers: {
				'Set-Cookie': await destroySession(session),
			},
		})
	}

	// Whops!
	return json({}, { status: 400 })
}

export default function DeleteUserResource() {
	return <div>Whops! You should have been redirected.</div>
}
