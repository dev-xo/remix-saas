import type { Plan } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function createStripeProduct(
  product: Partial<Plan>,
  params?: Stripe.ProductCreateParams,
) {
  if (!product || !product.id || !product.name)
    throw new Error('Missing required parameters to create Stripe Product.')

  return stripe.products.create({
    ...params,
    id: product.id,
    name: product.name,
    description: product.description || undefined,
  })
}
