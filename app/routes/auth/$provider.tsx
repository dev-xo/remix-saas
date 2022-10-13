import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/modules/auth'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request, params }) =>
	await authenticator.authenticate(params.provider as string, request)

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = ({ request }) => redirect('/login')

export default function ProviderRoute() {
	return <div>Whops! You should have been redirected.</div>
}
