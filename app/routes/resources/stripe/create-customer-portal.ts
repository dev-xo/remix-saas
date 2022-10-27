import type { ActionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { authenticator } from '~/services/auth/config.server';
import { createStripeCustomerPortalSession } from '~/services/stripe/utils.server';

/**
 * Remix - Action.
 * @required Template code.
 */
export const action = async ({ request }: ActionArgs) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	});

	// Checks for Customer ID into Auth Session.
	// On success: Redirects to Stripe Customer Portal.
	if (user.subscription?.customerId) {
		const customerId = user.subscription.customerId;
		const stripeRedirectUrl = await createStripeCustomerPortalSession(
			request,
			customerId,
		);

		if (typeof stripeRedirectUrl === 'string')
			return redirect(stripeRedirectUrl);
	}

	// Whops!
	return json({}, { status: 400 });
};
