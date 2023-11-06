import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  return json({})
}

export default function Register() {
  return (
    <div className="m-auto flex h-full max-w-md flex-col items-center justify-center px-6">
      <Outlet />
    </div>
  )
}
