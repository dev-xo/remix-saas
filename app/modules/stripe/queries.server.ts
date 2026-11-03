import { isMockServices } from '#app/utils/env.server'
import { PLANS } from '#app/modules/stripe/plans'
import { getStripe } from '#app/modules/stripe/stripe.server'
import { prisma } from '#app/utils/db.server'
import { getLocaleCurrency, HOST_URL } from '#app/utils/misc.server'
import { ERRORS } from '#app/utils/constants/errors'

/**
 * Creates a Stripe customer for a user.
 */
export async function createCustomer({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.customerId) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

  if (isMockServices()) {
    await prisma.user.update({
      where: { id: userId },
      data: { customerId: `local_${userId}` },
    })
    return true
  }

  const email = user.email ?? undefined
  const name = user.username ?? undefined
  const customer = await getStripe()
    .customers.create({ email, name })
    .catch((err) => console.error(err))
  if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

  await prisma.user.update({ where: { id: user.id }, data: { customerId: customer.id } })
  return true
}

/**
 * Creates a Stripe free tier subscription for a user.
 */
export async function createFreeSubscription({
  userId,
  request,
}: {
  userId: string
  request: Request
}) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })
  if (subscription) return false

  const currency = getLocaleCurrency(request)
  const plan = await prisma.plan.findUnique({
    where: { id: PLANS.FREE },
    include: { prices: true },
  })
  const yearlyPrice = plan?.prices.find(
    (price) => price.interval === 'year' && price.currency === currency,
  )
  if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  if (isMockServices()) {
    const now = Math.floor(Date.now() / 1000)
    await prisma.subscription.create({
      data: {
        id: `local_${userId}`,
        userId,
        planId: plan!.id,
        priceId: yearlyPrice.id,
        interval: yearlyPrice.interval,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: now + 365 * 24 * 60 * 60,
      },
    })
    return true
  }

  const stripeSubscription = await getStripe().subscriptions.create({
    customer: String(user.customerId),
    items: [{ price: yearlyPrice.id }],
  })
  if (!stripeSubscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  await prisma.subscription.create({
    data: {
      id: stripeSubscription.id,
      userId: user.id,
      planId: String(stripeSubscription.items.data[0].plan.product),
      priceId: String(stripeSubscription.items.data[0].price.id),
      interval: String(stripeSubscription.items.data[0].plan.interval),
      status: stripeSubscription.status,
      currentPeriodStart: stripeSubscription.items.data[0].current_period_start,
      currentPeriodEnd: stripeSubscription.items.data[0].current_period_end,
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
  })

  return true
}

/**
 * Creates a Stripe checkout session for a user.
 */
export async function createSubscriptionCheckout({
  userId,
  planId,
  planInterval,
  request,
}: {
  userId: string
  planId: string
  planInterval: string
  request: Request
}) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  })
  if (subscription?.planId !== PLANS.FREE) return

  const currency = getLocaleCurrency(request)
  const plan = await prisma.plan.findUnique({
    where: { id: planId },
    include: { prices: true },
  })

  const price = plan?.prices.find(
    (price) => price.interval === planInterval && price.currency === currency,
  )
  if (!price) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  if (isMockServices()) {
    const now = Math.floor(Date.now() / 1000)
    await prisma.subscription.update({
      where: { userId },
      data: {
        planId,
        priceId: price.id,
        interval: planInterval,
        currentPeriodStart: now,
        currentPeriodEnd: now + (planInterval === 'year' ? 365 : 30) * 24 * 60 * 60,
      },
    })
    return '/dashboard/checkout'
  }

  const checkout = await getStripe().checkout.sessions.create({
    customer: user.customerId,
    line_items: [{ price: price.id, quantity: 1 }],
    mode: 'subscription',
    success_url: `${HOST_URL}/dashboard/checkout`,
    cancel_url: `${HOST_URL}/dashboard/settings/billing`,
  })
  if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
  return checkout.url
}

/**
 * Creates a Stripe customer portal for a user.
 */
export async function createCustomerPortal({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  if (isMockServices()) return '/dashboard/settings/billing'

  const customerPortal = await getStripe().billingPortal.sessions.create({
    customer: user.customerId,
    return_url: `${HOST_URL}/dashboard/settings/billing`,
  })
  if (!customerPortal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
  return customerPortal.url
}
