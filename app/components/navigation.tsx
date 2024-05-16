import type { User } from '@prisma/client'
import { Link, useLocation, useSubmit, useNavigate } from '@remix-run/react'
import { ChevronUp, ChevronDown, Slash, Check, Settings, LogOut } from 'lucide-react'
import { PLANS } from '#app/modules/stripe/plans'
import { useRequestInfo } from '#app/utils/hooks/use-request-info'
import { userHasRole, getUserImgSrc, cn } from '#app/utils/misc'
import { ROUTE_PATH as LOGOUT_PATH } from '#app/routes/auth+/logout'
import { ROUTE_PATH as ADMIN_PATH } from '#app/routes/admin+/_layout'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as DASHBOARD_SETTINGS_PATH } from '#app/routes/dashboard+/settings'
import { ROUTE_PATH as DASHBOARD_SETTINGS_BILLING_PATH } from '#app/routes/dashboard+/settings.billing'
import { ThemeSwitcher } from '#app/components/misc/theme-switcher'
import { LanguageSwitcher } from '#app/components/misc/language-switcher'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '#app/components/ui/dropdown-menu'
import { Button, buttonVariants } from '#app/components/ui/button'
import { Logo } from '#app/components/logo'

/**
 * Required to handle JsonifyObject Typescript mismatch.
 * This will be fixed in future versions of Remix.
 */
type JsonifyObjectUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  image: {
    id: string
  } | null
  roles: {
    name: string
  }[]
  createdAt: string | null
  updatedAt: string | null
}

type NavigationProps = {
  user: JsonifyObjectUser | null
  planId?: string
}

export function Navigation({ user, planId }: NavigationProps) {
  const navigate = useNavigate()
  const submit = useSubmit()
  const requestInfo = useRequestInfo()

  const location = useLocation()
  const isAdminPath = location.pathname === ADMIN_PATH
  const isDashboardPath = location.pathname === DASHBOARD_PATH
  const isSettingsPath = location.pathname === DASHBOARD_SETTINGS_PATH
  const isBillingPath = location.pathname === DASHBOARD_SETTINGS_BILLING_PATH

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <div className="flex h-10 items-center gap-2">
          <Link
            to={DASHBOARD_PATH}
            prefetch="intent"
            className="flex h-10 items-center gap-1">
            <Logo />
          </Link>
          <Slash className="h-6 w-6 -rotate-12 stroke-[1.5px] text-primary/10" />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 px-2 data-[state=open]:bg-primary/5">
                <div className="flex items-center gap-2">
                  {user?.image?.id ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      alt={user.username ?? user.email}
                      src={getUserImgSrc(user.image?.id)}
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user?.username || ''}
                  </p>
                  <span className="flex h-5 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary/80">
                    {(planId && planId.charAt(0).toUpperCase() + planId.slice(1)) ||
                      'Free'}
                  </span>
                </div>
                <span className="flex flex-col items-center justify-center">
                  <ChevronUp className="relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                  <ChevronDown className="relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={8} className="min-w-56 bg-card p-2">
              <DropdownMenuLabel className="flex items-center text-xs font-normal text-primary/60">
                Personal Account
              </DropdownMenuLabel>
              <DropdownMenuItem className="h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2">
                <div className="flex items-center gap-2">
                  {user?.image?.id ? (
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      alt={user.username ?? user.email}
                      src={getUserImgSrc(user.image?.id)}
                    />
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                  )}

                  <p className="text-sm font-medium text-primary/80">
                    {user?.username || ''}
                  </p>
                </div>
                <Check className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60" />
              </DropdownMenuItem>

              {planId && planId === PLANS.FREE && (
                <>
                  <DropdownMenuSeparator className="mx-0 my-2" />
                  <DropdownMenuItem className="p-0 focus:bg-transparent">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => navigate(DASHBOARD_SETTINGS_BILLING_PATH)}>
                      Upgrade to PRO
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex h-10 items-center gap-3">
          <a
            href="https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation"
            className={cn(
              `${buttonVariants({ variant: 'outline', size: 'sm' })} group hidden h-8 gap-2 rounded-full bg-transparent px-2 pr-2.5 md:flex`,
            )}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-sm text-primary/60 transition group-hover:text-primary group-focus:text-primary">
              Documentation
            </span>
          </a>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                {user?.image?.id ? (
                  <img
                    className="min-h-8 min-w-8 rounded-full object-cover"
                    alt={user.username ?? user.email}
                    src={getUserImgSrc(user.image?.id)}
                  />
                ) : (
                  <span className="min-h-8 min-w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={8}
              className="fixed -right-4 min-w-56 bg-card p-2">
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary">
                  {user?.username || ''}
                </p>
                <p className="text-sm text-primary/60">{user?.email}</p>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => navigate(DASHBOARD_SETTINGS_PATH)}>
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Settings
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  'group flex h-9 justify-between rounded-md px-2 hover:bg-transparent',
                )}>
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Theme
                </span>
                <ThemeSwitcher userPreference={requestInfo.userPrefs.theme} />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  'group flex h-9 justify-between rounded-md px-2 hover:bg-transparent',
                )}>
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Language
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => submit({}, { action: LOGOUT_PATH, method: 'POST' })}>
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Log Out
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3">
        {user && userHasRole(user, 'admin') && (
          <div
            className={`flex h-12 items-center border-b-2 ${isAdminPath ? 'border-primary' : 'border-transparent'}`}>
            <Link
              to={ADMIN_PATH}
              prefetch="intent"
              className={cn(
                `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`,
              )}>
              Admin
            </Link>
          </div>
        )}
        <div
          className={`flex h-12 items-center border-b-2 ${isDashboardPath ? 'border-primary' : 'border-transparent'}`}>
          <Link
            to={DASHBOARD_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`,
            )}>
            Dashboard
          </Link>
        </div>
        <div
          className={`flex h-12 items-center border-b-2 ${isSettingsPath ? 'border-primary' : 'border-transparent'}`}>
          <Link
            to={DASHBOARD_SETTINGS_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`,
            )}>
            Settings
          </Link>
        </div>
        <div
          className={`flex h-12 items-center border-b-2 ${isBillingPath ? 'border-primary' : 'border-transparent'}`}>
          <Link
            to={DASHBOARD_SETTINGS_BILLING_PATH}
            prefetch="intent"
            className={cn(
              `${buttonVariants({ variant: 'ghost', size: 'sm' })} text-primary/80`,
            )}>
            Billing
          </Link>
        </div>
      </div>
    </nav>
  )
}
