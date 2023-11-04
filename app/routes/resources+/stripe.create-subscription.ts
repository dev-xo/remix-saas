import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

import { getUserById } from '~/models/user/get-user'
import { getPlanById } from '~/models/plan/get-plan'
import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { createSubscription } from '~/models/subscription/create-subscription'

import { PlanId } from '~/services/stripe/plans'
import { createStripeSubscription } from '~/services/stripe/api/create-subscription'
import { getDefaultCurrency } from '~/utils/locales'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')

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
  if (!storedSubscription) throw new Error('Unable to create Subscription.')

  return redirect('/account')
}
