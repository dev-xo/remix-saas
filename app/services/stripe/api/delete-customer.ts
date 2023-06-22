import type { User } from '@prisma/client'
import { stripe } from '~/services/stripe/config.server'

export async function deleteStripeCustomer(customerId?: User['customerId']) {
  if (!customerId)
    throw new Error('Missing required parameters to delete Stripe Customer.')

  return stripe.customers.del(customerId)
}
