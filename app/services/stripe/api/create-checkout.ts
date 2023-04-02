import type { Stripe } from 'stripe'
import type { User, Price } from '@prisma/client'

import { stripe } from '~/services/stripe/config.server'
import { HOST_URL } from '~/utils/http'

export async function createStripeCheckoutSession(
  customerId: User['customerId'],
  priceId: Price['id'],
  params?: Stripe.Checkout.SessionCreateParams,
) {
  if (!customerId || !priceId)
    throw new Error('Missing required parameters to create Stripe Checkout Session.')

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    payment_method_types: ['card'],
    success_url: `${HOST_URL}/checkout`,
    cancel_url: `${HOST_URL}/plans`,
    ...params,
  })
  if (!session?.url) throw new Error('Unable to create Stripe Checkout Session.')

  return session.url
}
