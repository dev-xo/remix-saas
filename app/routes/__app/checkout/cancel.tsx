import type { LoaderArgs } from '@remix-run/node'
import type { AuthSession } from '~/services/auth/session.server'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserByIdIncludingSubscription } from '~/models/user.server'

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader = async ({ request }: LoaderArgs) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Checks for User existence in database.
	const dbUser = await getUserByIdIncludingSubscription(user.id)

	// Checks for Subscription ID existence.
	// Updates Auth Session, with newly created Customer ID.
	if (dbUser && dbUser.subscription?.customerId) {
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
