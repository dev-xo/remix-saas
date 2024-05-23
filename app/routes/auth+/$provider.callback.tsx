import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'

export const ROUTE_PATH = '/auth/:provider/callback' as const

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (typeof params.provider !== 'string') throw new Error('Invalid provider.')

  return authenticator.authenticate(params.provider, request, {
    successRedirect: DASHBOARD_PATH,
    failureRedirect: LOGIN_PATH,
  })
}
