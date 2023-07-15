import type { User } from '@prisma/client'

import { stripe } from '~/services/stripe/config.server'
import { HOST_URL } from '~/utils/http'

export async function createStripeCustomerPortalSession(customerId: User['customerId']) {
  if (!customerId)
    throw new Error('Missing required parameters to create Stripe Customer Portal.')

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${HOST_URL}/resources/stripe/create-customer-portal`,
  })
  if (!session?.url) throw new Error('Unable to create Stripe Customer Portal Session.')

  return session.url
}
