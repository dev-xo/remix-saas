import type { ActionArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
	return await authenticator.logout(request, { redirectTo: '/' })
}

export default function LogoutRoute() {
	return <div>Whops! You should have been redirected.</div>
}
