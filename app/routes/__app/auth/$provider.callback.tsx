import type { LoaderArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth/config.server';

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader = async ({ request, params }: LoaderArgs) =>
	await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/',
		failureRedirect: '/login',
	});

export default function ProviderCallbackRoute() {
	return <div>Whops! You should have been redirected.</div>;
}
