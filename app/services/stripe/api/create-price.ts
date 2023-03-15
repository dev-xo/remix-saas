import type { Stripe } from 'stripe'
import type { Plan, Price } from '@prisma/client'
import type { PlanId, Interval } from '~/services/stripe/plans'
import { stripe } from '~/services/stripe/config.server'

export type StripePricePayload = {
  id: PlanId
  unit_amount: Price['amount']
  currency: Price['currency']
  tax_behavior: 'inclusive'
  recurring: {
    interval: Interval
  }
}

export async function createStripePrice(
  id: Plan['id'],
  price: Partial<Price>,
  params?: Stripe.PriceCreateParams,
) {
  if (!id || !price)
    throw new Error('Missing required parameters to create Stripe Price.')

  return stripe.prices.create({
    ...params,
    product: id,
    currency: price.currency ?? 'usd',
    unit_amount: price.amount ?? 0,
    tax_behavior: 'inclusive',
    recurring: {
      interval: (price.interval as Interval) ?? 'month',
    },
  })
}
