import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function retrieveStripeSubscription(
  id?: Subscription['id'],
  params?: Stripe.SubscriptionRetrieveParams,
) {
  if (!id) throw new Error('Missing required parameters to retrieve Stripe Subscription.')
  return stripe.subscriptions.retrieve(id, params)
}
