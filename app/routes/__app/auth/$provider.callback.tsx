import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

/**
 * Remix - Loader.
 */
export async function loader({ request, params }: LoaderArgs) {
	return await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/account',
		failureRedirect: '/login',
	})
}

export default function AuthProviderCallbackRoute() {
	return <div>Whops! You should have been redirected.</div>
}
