import type { ActionArgs } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'

export async function action({ request }: ActionArgs) {
	return await authenticator.logout(request, { redirectTo: '/' })
}

export default function LogoutResource() {
	return <div>Whops! You should have been redirected.</div>
}
