import type { LoaderArgs } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'

export async function loader({ request, params }: LoaderArgs) {
	return await authenticator.authenticate(params.provider as string, request, {
		successRedirect: '/account',
		failureRedirect: '/login',
	})
}

export default function AuthProviderCallbackResource() {
	return <div>Whops! You should have been redirected.</div>
}
