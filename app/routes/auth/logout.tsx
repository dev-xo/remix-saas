import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/modules/auth'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request }) =>
	await authenticator.logout(request, { redirectTo: '/' })

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = ({ request }) => redirect('/')

export default function LogoutRoute() {
	return <div>Whops! You should have been redirected.</div>
}
