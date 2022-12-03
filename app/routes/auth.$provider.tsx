import type { ActionArgs } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'

export async function action({ request, params }: ActionArgs) {
	return await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/account',
		failureRedirect: '/login',
	})
}

export default function AuthProviderResource() {
	return <div>Whops! You should have been redirected.</div>
}
