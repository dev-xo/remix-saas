import type { Stripe } from 'stripe'
import type { User, Price } from '@prisma/client'
import { stripe } from '~/services/stripe/config.server'

export async function createStripeSubscription(
  customerId: User['customerId'],
  price: Price['id'],
  params?: Stripe.SubscriptionCreateParams,
) {
  if (!customerId || !price)
    throw new Error('Missing required parameters to create Stripe Subscription.')

  return stripe.subscriptions.create({
    ...params,
    customer: customerId,
    items: [{ price }],
  })
}
