import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect } from '@remix-run/node'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { retrieveStripeSubscription } from '~/modules/stripe/queries'

/**
 * Remix - Loader.
 * @protected Template code.
 *
 * If current Subscription has expired: Updates Auth Session accordingly.
 */
export const loader: LoaderFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as AuthSession | null

	if (user && user.subscription[0]?.subscriptionId) {
		const subscriptionId = user.subscription[0].subscriptionId
		const subscription = await retrieveStripeSubscription(subscriptionId)

		/**
		 * If Subscription has expired: Updates Auth Session accordingly.
		 */
		if (subscription && subscription?.status === 'canceled') {
			let session = await getSession(request.headers.get('Cookie'))

			session.set(authenticator.sessionKey, {
				...user,
				subscription: [{ customerId: user.subscription[0].customerId }],
			} as AuthSession)

			return redirect('/account', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
			/**
			 * Else:
			 * Sets a value in the session that is only valid until the next session.get().
			 * Used to skip redirect loop at checking subscription expiration.
			 */
		} else {
			let session = await getSession(request.headers.get('Cookie'))

			session.flash('SKIP_EXPIRATION_CHECK', true)

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
