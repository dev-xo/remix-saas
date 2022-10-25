import type { ActionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, destroySession } from '~/services/auth/session.server'
import { getUserByIdIncludingSubscription } from '~/models/user.server'
import { deleteStripeCustomer } from '~/services/stripe/utils.server'
import { deleteUser } from '~/models/user.server'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action = async ({ request }: ActionArgs) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request)

	if (user) {
		// Checks database for Subscription Customer existence.
		// On success: Deletes current Stripe Customer.
		const dbUser = await getUserByIdIncludingSubscription(user.id)

		if (dbUser && dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			await deleteStripeCustomer(customerId)
		}

		// Deletes current User from database.
		// This will also delete Subscription Model in cascade mode.
		const userId = user.id
		await deleteUser(userId)

		// Destroys Auth Session and redirects with updated headers.
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
