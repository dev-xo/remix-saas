import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

import { getPlanById } from '~/models/plan/get-plan'
import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { createSubscription } from '~/models/subscription/create-subscription'

import { PlanId } from '~/services/stripe/plans'
import { createStripeSubscription } from '~/services/stripe/api/create-subscription'
import { getDefaultCurrency } from '~/utils/locales'

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  const subscription = await getSubscriptionByUserId(user.id)

  if (subscription?.id) return redirect('/account')
  if (!user.customerId) throw new Error('Unable to find Customer ID.')

  // Get client's currency and Free Plan price ID.
  const currency = getDefaultCurrency(request)
  const freePlan = await getPlanById(PlanId.FREE, { prices: true })
  const freePlanPrice = freePlan?.prices.find(
    (price) => price.interval === 'year' && price.currency === currency,
  )
  if (!freePlanPrice) throw new Error('Unable to find Free Plan price.')

  // Create Stripe Subscription.
  const newSubscription = await createStripeSubscription(
    user.customerId,
    freePlanPrice.id,
  )
  if (!newSubscription) throw new Error('Unable to create Stripe Subscription.')

  // Store Subscription into database.
  const storedSubscription = await createSubscription({
    id: newSubscription.id,
    userId: user.id,
    planId: String(newSubscription.items.data[0].plan.product),
    priceId: String(newSubscription.items.data[0].price.id),
    interval: String(newSubscription.items.data[0].plan.interval),
    status: newSubscription.status,
    currentPeriodStart: newSubscription.current_period_start,
    currentPeriodEnd: newSubscription.current_period_end,
    cancelAtPeriodEnd: newSubscription.cancel_at_period_end,
  })

  // Update session.
  const session = await getSession(request.headers.get('Cookie'))

  session.set(authenticator.sessionKey, {
    ...user,
    subscription: {
      ...storedSubscription,
    },
  } as UserSession)

  return redirect('/account', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
