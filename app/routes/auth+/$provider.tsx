import type { DataFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

export async function action({ request, params }: DataFunctionArgs) {
	if (typeof params.provider !== 'string') throw new Error('Invalid provider.')

	return await authenticator.authenticate(params.provider, request, {
		successRedirect: '/account',
		failureRedirect: '/login',
	})
}

export default function AuthProviderResource() {
	return <div>Whops! You should have been redirected.</div>
}
