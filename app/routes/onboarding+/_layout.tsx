import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { requireUser } from '#app/modules/auth/auth.server'
import { getDomainPathname } from '#app/utils/misc.server'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from '#app/routes/onboarding+/username'

export const ROUTE_PATH = '/onboarding' as const

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)

  const pathname = getDomainPathname(request)
  const isOnboardingPathname = pathname === ROUTE_PATH
  const isOnboardingUsernamePathname = pathname === ONBOARDING_USERNAME_PATH

  if (isOnboardingPathname) return redirect(DASHBOARD_PATH)
  if (user.username && isOnboardingUsernamePathname) return redirect(DASHBOARD_PATH)

  return json({})
}

export default function Onboarding() {
  return (
    <div className="relative flex h-screen w-full bg-card">
      <div className="absolute left-1/2 top-8 mx-auto -translate-x-1/2 transform justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-primary"
          viewBox="0 0 24 24"
          fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.5475 3.25H13.5475C15.3866 3.24999 16.8308 3.24998 17.9694 3.3786C19.1316 3.50988 20.074 3.78362 20.8574 4.40229C21.0919 4.58749 21.3093 4.79205 21.507 5.0138C22.1732 5.76101 22.4707 6.66669 22.6124 7.77785C22.75 8.85727 22.75 10.2232 22.75 11.9473V12.0528C22.75 13.7768 22.75 15.1427 22.6124 16.2222C22.4707 17.3333 22.1732 18.239 21.507 18.9862C21.3093 19.208 21.0919 19.4125 20.8574 19.5977C20.074 20.2164 19.1316 20.4901 17.9694 20.6214C16.8308 20.75 15.3866 20.75 13.5475 20.75H10.4525C8.61345 20.75 7.16917 20.75 6.03058 20.6214C4.86842 20.4901 3.926 20.2164 3.14263 19.5977C2.90811 19.4125 2.69068 19.2079 2.49298 18.9862C1.82681 18.239 1.52932 17.3333 1.38763 16.2222C1.24998 15.1427 1.24999 13.7767 1.25 12.0527V12.0527V11.9473V11.9472C1.24999 10.2232 1.24998 8.85727 1.38763 7.77785C1.52932 6.66669 1.82681 5.76101 2.49298 5.0138C2.69068 4.79205 2.90811 4.58749 3.14263 4.40229C3.926 3.78362 4.86842 3.50988 6.03058 3.3786C7.16917 3.24998 8.61345 3.24999 10.4525 3.25H10.4525H13.5475ZM10 8C7.79086 8 6 9.79086 6 12C6 14.2091 7.79086 16 10 16C10.7286 16 11.4117 15.8052 12.0001 15.4648C12.5884 15.8049 13.2719 16 13.9998 16C16.2089 16 17.9998 14.2091 17.9998 12C17.9998 9.79086 16.2089 8 13.9998 8C13.2719 8 12.5884 8.19505 12.0001 8.53517C11.4117 8.19481 10.7286 8 10 8ZM8 12C8 10.8954 8.89543 10 10 10C11.1046 10 12 10.8954 12 12C12 13.1046 11.1046 14 10 14C8.89543 14 8 13.1046 8 12ZM13.9998 14C13.8271 14 13.6599 13.9783 13.5004 13.9374C13.8187 13.3634 14 12.7029 14 12C14 11.2971 13.8187 10.6366 13.5004 10.0626C13.6599 10.0217 13.8271 10 13.9998 10C15.1043 10 15.9998 10.8954 15.9998 12C15.9998 13.1046 15.1043 14 13.9998 14Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="z-10 h-screen w-screen">
        <Outlet />
      </div>
      <div className="base-grid fixed h-screen w-screen opacity-40" />
      <div className="fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
    </div>
  )
}
