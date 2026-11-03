import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticate } from '#app/modules/auth/auth.server'

export const ROUTE_PATH = '/auth/magic-link' as const

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticate('TOTP', request)
}
