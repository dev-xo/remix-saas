import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { ShoppingBasket, ExternalLink } from 'lucide-react'
import { requireUserWithRole } from '#app/utils/permissions.server'
import { prisma } from '#app/utils/db.server'
import { cn } from '#app/utils/misc.js'
import { siteConfig } from '#app/utils/constants/brand'
import { buttonVariants } from '#app/components/ui/button'
import { Navigation } from '#app/components/navigation'
import { Header } from '#app/components/header'

export const ROUTE_PATH = '/admin' as const

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Admin` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithRole(request, 'admin')
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })
  return json({ user, subscription } as const)
}

export default function Admin() {
  const { user, subscription } = useLoaderData<typeof loader>()

  return (
    <div className="flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black">
      <Navigation user={user} planId={subscription?.planId} />
      <Header />

      <div className="flex h-full w-full px-6 py-8">
        <div className="mx-auto flex h-full w-full max-w-screen-xl gap-12">
          <div className="flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black">
            <div className="flex w-full flex-col rounded-lg p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-medium text-primary">Customers</h2>
                <p className="text-sm font-normal text-primary/60">
                  Simple admin panel to manage your products and sales.
                </p>
              </div>
            </div>
            <div className="flex w-full px-6">
              <div className="w-full border-b border-border" />
            </div>
            <div className="mx-auto flex w-full flex-col items-center p-6">
              <div className="relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card">
                <div className="z-10 flex max-w-[460px] flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40">
                    <ShoppingBasket className="h-8 w-8 stroke-[1.5px] text-primary/60" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-base font-medium text-primary">Track your Sales</p>
                    <p className="text-center text-base font-normal text-primary/60">
                      This is a simple Demo that you could use to manage your products and
                      sales.
                    </p>
                  </div>
                </div>
                <div className="z-10 flex items-center justify-center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation"
                    className={cn(
                      `${buttonVariants({ variant: 'ghost', size: 'sm' })} gap-2`,
                    )}>
                    <span className="text-sm font-medium text-primary/60 group-hover:text-primary">
                      Explore Documentation
                    </span>
                    <ExternalLink className="h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" />
                  </a>
                </div>

                <div className="base-grid absolute h-full w-full opacity-40" />
                <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
