import type { ActionFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'

export const ROUTE_PATH = '/auth/:provider' as const

export async function loader() {
  return redirect(LOGIN_PATH)
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (typeof params.provider !== 'string') throw new Error('Invalid provider.')
  return authenticator.authenticate(params.provider, request)
}
