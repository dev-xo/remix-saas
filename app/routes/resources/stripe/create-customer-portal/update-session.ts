import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'

/**
 * Remix - Loader.
 * @protected Template code.
 *
 * On Customer Portal Return: Updates Auth Session accordingly.
 */
export const loader: LoaderFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as AuthSession | null

	if (user) {
		/**
		 * Gets User from Database.
		 */
		const dbUser = await getUserByProviderIdIncludingSubscription(
			user.providerId,
		)

		/**
		 * Checks for User Subscription existence.
		 * On success:
		 * - Parses a Cookie and returns the associated Session.
		 * - Updates Auth Session accordingly.
		 * - Commits the session and redirects with newly updated headers.
		 */
		if (dbUser && dbUser.subscription[0]?.subscriptionId) {
			let session = await getSession(request.headers.get('Cookie'))

			session.set(authenticator.sessionKey, {
				...user,
				subscription: [{ ...dbUser.subscription[0] }],
			} as AuthSession)

			return redirect('/account', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
		}
	}

	/**
	 * Whops!
	 */
	return redirect('/')
}
