import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import type { Interval, Plan } from '#app/modules/stripe/plans'
import { useState } from 'react'
import { Form, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { requireSessionUser } from '#app/modules/auth/auth.server'
import { PLANS, PRICING_PLANS, INTERVALS, CURRENCIES } from '#app/modules/stripe/plans'
import {
  createSubscriptionCheckout,
  createCustomerPortal,
} from '#app/modules/stripe/queries.server'
import { prisma } from '#app/utils/db.server'
import { getLocaleCurrency } from '#app/utils/misc.server'
import { INTENTS } from '#app/utils/constants/misc'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { Switch } from '#app/components/ui/switch'
import { Button } from '#app/components/ui/button'

export const ROUTE_PATH = '/dashboard/settings/billing' as const

export const meta: MetaFunction = () => {
  return [{ title: 'Remix SaaS - Billing' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: LOGIN_PATH,
  })

  const subscription = await prisma.subscription.findUnique({
    where: { userId: sessionUser.id },
  })
  const currency = getLocaleCurrency(request)

  return json({ subscription, currency } as const)
}

export async function action({ request }: ActionFunctionArgs) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: LOGIN_PATH,
  })

  const formData = await request.formData()
  const intent = formData.get(INTENTS.INTENT)

  if (intent === INTENTS.SUBSCRIPTION_CREATE_CHECKOUT) {
    const planId = String(formData.get('planId'))
    const planInterval = String(formData.get('planInterval'))
    const checkoutUrl = await createSubscriptionCheckout({
      userId: sessionUser.id,
      planId,
      planInterval,
      request,
    })
    if (!checkoutUrl) return json({ success: false } as const)
    return redirect(checkoutUrl)
  }
  if (intent === INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL) {
    const customerPortalUrl = await createCustomerPortal({
      userId: sessionUser.id,
    })
    if (!customerPortalUrl) return json({ success: false } as const)
    return redirect(customerPortalUrl)
  }

  return json({})
}

export default function DashboardBilling() {
  const { subscription, currency } = useLoaderData<typeof loader>()

  const [selectedPlanId, setSelectedPlanId] = useState<Plan>(
    (subscription?.planId as Plan) ?? PLANS.FREE,
  )
  const [selectedPlanInterval, setSelectedPlanInterval] = useState<Interval>(
    INTERVALS.MONTH,
  )

  return (
    <div className="flex h-full w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2 p-6 py-2">
        <h2 className="text-xl font-medium text-primary">This is a demo app.</h2>
        <p className="text-sm font-normal text-primary/60">
          Remix SaaS is a demo app that uses Stripe test environment. You can find a list
          of test card numbers on the{' '}
          <a
            href="https://stripe.com/docs/testing#cards"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary/80 underline">
            Stripe docs
          </a>
          .
        </p>
      </div>

      {/* Plans */}
      <div className="flex w-full flex-col items-start rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-xl font-medium text-primary">Plan</h2>
          <p className="flex items-start gap-1 text-sm font-normal text-primary/60">
            You are currently on the{' '}
            <span className="flex h-[18px] items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80">
              {subscription
                ? subscription.planId?.charAt(0).toUpperCase() +
                  subscription.planId.slice(1)
                : 'Free'}
            </span>
            plan.
          </p>
        </div>

        {subscription?.planId === PLANS.FREE && (
          <div className="flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0">
            {Object.values(PRICING_PLANS).map((plan) => (
              <div
                key={plan.id}
                tabIndex={0}
                role="button"
                className={`flex w-full select-none items-center rounded-md border border-border hover:border-primary/60 ${
                  selectedPlanId === plan.id && 'border-primary/60'
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedPlanId(plan.id)
                }}>
                <div className="flex w-full flex-col items-start p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-primary">
                      {plan.name}
                    </span>
                    {plan.id !== PLANS.FREE && (
                      <span className="flex items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80">
                        {currency === CURRENCIES.USD ? '$' : '€'}{' '}
                        {selectedPlanInterval === INTERVALS.MONTH
                          ? plan.prices[INTERVALS.MONTH][currency] / 100
                          : plan.prices[INTERVALS.YEAR][currency] / 100}{' '}
                        / {selectedPlanInterval === INTERVALS.MONTH ? 'month' : 'year'}
                      </span>
                    )}
                  </div>
                  <p className="text-start text-sm font-normal text-primary/60">
                    {plan.description}
                  </p>
                </div>

                {/* Billing Switch */}
                {plan.id !== PLANS.FREE && (
                  <div className="flex items-center gap-2 px-4">
                    <label
                      htmlFor="interval-switch"
                      className="text-start text-sm text-primary/60">
                      {selectedPlanInterval === INTERVALS.MONTH ? 'Monthly' : 'Yearly'}
                    </label>
                    <Switch
                      id="interval-switch"
                      checked={selectedPlanInterval === INTERVALS.YEAR}
                      onCheckedChange={() =>
                        setSelectedPlanInterval((prev) =>
                          prev === INTERVALS.MONTH ? INTERVALS.YEAR : INTERVALS.MONTH,
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {subscription && subscription.planId !== PLANS.FREE && (
          <div className="flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0">
            <div className="flex w-full items-center overflow-hidden rounded-md border border-primary/60">
              <div className="flex w-full flex-col items-start p-4">
                <div className="flex items-end gap-2">
                  <span className="text-base font-medium text-primary">
                    {subscription.planId.charAt(0).toUpperCase() +
                      subscription.planId.slice(1)}
                  </span>
                  <p className="flex items-start gap-1 text-sm font-normal text-primary/60">
                    {subscription.cancelAtPeriodEnd === true ? (
                      <span className="flex h-[18px] items-center text-sm font-medium text-red-500">
                        Expires
                      </span>
                    ) : (
                      <span className="flex h-[18px] items-center text-sm font-medium text-green-500">
                        Renews
                      </span>
                    )}
                    on:{' '}
                    {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString(
                      'en-US',
                    )}
                    .
                  </p>
                </div>
                <p className="text-start text-sm font-normal text-primary/60">
                  {PRICING_PLANS[PLANS.PRO].description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            You will not be charged for testing the subscription upgrade.
          </p>
          {subscription?.planId === PLANS.FREE && (
            <Form method="POST">
              <input type="hidden" name="planId" value={selectedPlanId} />
              <input type="hidden" name="planInterval" value={selectedPlanInterval} />
              <Button
                type="submit"
                size="sm"
                name={INTENTS.INTENT}
                value={INTENTS.SUBSCRIPTION_CREATE_CHECKOUT}
                disabled={selectedPlanId === PLANS.FREE}>
                Upgrade to PRO
              </Button>
            </Form>
          )}
        </div>
      </div>

      {/* Manage Subscription */}
      <div className="flex w-full flex-col items-start rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-2 p-6">
          <h2 className="text-xl font-medium text-primary">Manage Subscription</h2>
          <p className="flex items-start gap-1 text-sm font-normal text-primary/60">
            Update your payment method, billing address, and more.
          </p>
        </div>

        <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card">
          <p className="text-sm font-normal text-primary/60">
            You will be redirected to the Stripe Customer Portal.
          </p>
          <Form method="POST">
            <Button
              type="submit"
              size="sm"
              name={INTENTS.INTENT}
              value={INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL}>
              Manage
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}
