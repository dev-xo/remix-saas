import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'

/**
 * Remix - Loader.
 * @protected Template code.
 *
 * On Stripe Checkout Success: Updates Auth Session accordingly.
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

			/**
			 * Sets a value in the session that is only valid until the next session.get().
			 * Used to enhance UI experience.
			 */
			dbUser.subscription[0].status === 'active' &&
				session.flash('HAS_SUCCESSFULLY_SUBSCRIBED', true)

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
