import type { LoaderFunction } from '@remix-run/node'
import type { SocialsProvider } from 'remix-auth-socials'
import { authenticator } from '~/modules/auth'

/**
 * Remix - Loader.
 * @protected Template code.
 */
export const loader: LoaderFunction = async ({ request, params }) =>
	await authenticator.authenticate(
		params.provider !== 'twitter'
			? (params.provider as SocialsProvider)
			: params.provider,
		request,
		{
			successRedirect: '/',
			failureRedirect: '/login',
		},
	)

export default function ProviderCallbackRoute() {
	return <div>Whops! You should have been redirected...</div>
}
