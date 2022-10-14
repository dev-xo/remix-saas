import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request)

	if (user) {
		// Gets User from database.
		const dbUser = await getUserByProviderIdIncludingSubscription(
			user.providerId,
		)

		// Checks for Subscription ID existence.
		// On success: Updates Auth Session accordingly.
		if (dbUser && dbUser.subscription?.subscriptionId) {
			let session = await getSession(request.headers.get('Cookie'))

			session.set(authenticator.sessionKey, {
				...user,
				subscription: { ...dbUser.subscription },
			} as AuthSession)

			// Sets a value in the session that is only valid until the next session.get().
			// Used to enhance UI experience.
			dbUser.subscription.status === 'active' &&
				session.flash('HAS_SUCCESSFULLY_SUBSCRIBED', true)

			return redirect('/account', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
		}
	}

	// Whops!
	return redirect('/')
}
