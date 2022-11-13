import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

/**
 * Remix - Action.
 */
export const action = async ({ request }: ActionArgs) => {
	return await authenticator.logout(request, { redirectTo: '/' })
}

/**
 * Remix - Loader.
 */
export const loader = async ({ request }: LoaderArgs) => redirect('/')

export default function LogoutRoute() {
	return <div>Whops! You should have been redirected.</div>
}
