import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { SocialsProvider } from 'remix-auth-socials'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/modules/auth'

/**
 * Remix - Action.
 * @protected Template code.
 */
export const action: ActionFunction = async ({ request, params }) =>
	await authenticator.authenticate(
		params.provider !== 'twitter'
			? (params.provider as SocialsProvider)
			: params.provider,
		request,
	)

/**
 * Remix - Loader.
 * @protected Template code.
 */
export const loader: LoaderFunction = ({ request }) => redirect('/login')

export default function ProviderRoute() {
	return <div>Whops! You should have been redirected...</div>
}
