import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticate } from '#app/modules/auth/auth.server'

export const ROUTE_PATH = '/auth/:provider/callback' as const

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (typeof params.provider !== 'string') throw new Error('Invalid provider.')

  return authenticate(params.provider, request)
}
