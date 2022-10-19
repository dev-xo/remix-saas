import type { LoaderFunction } from '@remix-run/node';
import type { AuthSession } from '~/services/auth/session.server';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth/config.server';
import { getSession, commitSession } from '~/services/auth/session.server';
import { retrieveStripeSubscription } from '~/services/stripe/utils.server';

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request);

	// Checks for Subscription ID existence into Auth Session.
	if (user && user.subscription?.subscriptionId) {
		const subscriptionId = user.subscription.subscriptionId;
		const subscription = await retrieveStripeSubscription(subscriptionId);

		// If Subscription has expired: Updates Auth Session accordingly.
		if (subscription && subscription?.status === 'canceled') {
			let session = await getSession(request.headers.get('Cookie'));

			session.set(authenticator.sessionKey, {
				...user,
				subscription: { customerId: user.subscription.customerId },
			} as AuthSession);

			return redirect('/account', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			});
		}

		// Sets a value in the session that is only valid until the next session.get().
		// Used to skip redirect loop at checking subscription expiration.
		else {
			let session = await getSession(request.headers.get('Cookie'));

			session.flash('SKIP_EXPIRATION_CHECK', true);

			return redirect('/account', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			});
		}
	}

	// Whops!
	return redirect('/');
};
