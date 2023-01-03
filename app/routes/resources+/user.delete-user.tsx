import type { DataFunctionArgs } from '@remix-run/node'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, destroySession } from '~/services/auth/session.server'

import { getUserById } from '~/models/user/get-user'
import { deleteUser } from '~/models/user/delete-user'
import { retrieveStripeCustomer } from '~/services/stripe/api/retrieve-stripe-customer'
import { deleteStripeCustomer } from '~/services/stripe/api/delete-stripe-customer'

export const action = async ({ request }: DataFunctionArgs) => {
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
			const stripeCustomer = await retrieveStripeCustomer({ customerId })
			if (stripeCustomer) await deleteStripeCustomer({ customerId })
		}

		// Deletes user from database.
		await deleteUser({ id: userId })

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
