import type { ActionArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

/**
 * Remix - Action.
 */
export async function action({ request, params }: ActionArgs) {
	return await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/account',
		failureRedirect: '/login',
	})
}

export default function AuthProviderRoute() {
	return <div>Whops! You should have been redirected.</div>
}
