import type { ActionArgs } from '@remix-run/node'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, destroySession } from '~/services/auth/session.server'
import { getUserById } from '~/models/user.server'
import { deleteStripeCustomer } from '~/services/stripe/utils.server'
import { deleteUser } from '~/models/user.server'

/**
 * Remix - Action.
 */
export const action = async ({ request }: ActionArgs) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	})

	/**
	 * Checks for user existence in database.
	 */
	const dbUser = await getUserById({
		id: user.id,
		include: {
			subscription: true,
		},
	})

	if (dbUser) {
		/**
		 * Deletes current Stripe Customer.
		 */
		if (dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			await deleteStripeCustomer(customerId)
		}

		/**
		 * Deletes current user from database.
		 */
		const userId = dbUser.id
		await deleteUser(userId)

		/**
		 * Redirects to 'x' destroying current Auth Session.
		 */
		let session = await getSession(request.headers.get('Cookie'))

		return redirect('/', {
			headers: {
				'Set-Cookie': await destroySession(session),
			},
		})
	}

	/**
	 * Whops!
	 */
	return json({}, { status: 400 })
}
