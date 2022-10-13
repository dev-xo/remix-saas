import type { LoaderFunction } from '@remix-run/node'
import { authenticator } from '~/modules/auth'

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request, params }) =>
	await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/',
		failureRedirect: '/login',
	})

export default function ProviderCallbackRoute() {
	return <div>Whops! You should have been redirected.</div>
}
