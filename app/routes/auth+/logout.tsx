import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { logout } from '#app/modules/auth/auth.server'

export const ROUTE_PATH = '/auth/logout' as const

export async function loader({ request }: LoaderFunctionArgs) {
  return logout(request)
}

export async function action({ request }: ActionFunctionArgs) {
  return logout(request)
}
