import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLocation } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/account',
  })
  return json({})
}

export default function Login() {
  const location = useLocation()

  return (
    <div className="m-auto flex h-full max-w-md flex-col items-center justify-center px-6">
      {/* Headers. */}
      {location && location.pathname === '/login' && (
        <>
          <div className="flex w-full flex-col items-center">
            <img
              src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/map.png"
              alt=""
              className="z-10 h-28 w-28 transform select-none transition hover:scale-110"
            />
            <div className="my-3" />

            <h5 className="text-center text-2xl font-semibold text-gray-200">
              Welcome back traveler.
            </h5>
            <div className="my-1" />

            <p className="max-w-sm text-center font-semibold text-gray-400">
              Please, continue with your preferred authentication method.
            </p>
          </div>
          <div className="my-3" />
        </>
      )}

      {/* Outlet. */}
      <Outlet />
      <div className="my-3" />

      {/* Example Privacy Message. */}
      <p className="text-center text-sm font-semibold text-gray-400">
        By clicking “Continue" you acknowledge that this is a simple demo, and can be used
        in the way you like.
      </p>
    </div>
  )
}
