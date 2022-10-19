import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { authenticator } from '~/services/auth/config.server';

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request, params }) => {
	// Gets values from `formData`.
	const formData = await request.clone().formData();
	const { formType } = Object.fromEntries(formData);

	// Based on `formType`, we'll know where to redirect in case of error.
	// Used to validate form data.
	const loginEmailRoute = '/login/email';
	const signupEmailRoute = '/signup/email';
	const fallbackRoute = '/login';
	const failureRedirect =
		formType === 'login' ? loginEmailRoute : signupEmailRoute;

	return await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/',
		failureRedirect: formType ? failureRedirect : fallbackRoute,
	});
};

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = ({ request }) => redirect('/login');

export default function ProviderRoute() {
	return <div>Whops! You should have been redirected.</div>;
}
