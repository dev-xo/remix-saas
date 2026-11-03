import Stripe from 'stripe'
import { isMockServices } from '#app/utils/env.server'

let client: Stripe | undefined

export function getStripe() {
  if (isMockServices()) throw new Error('Stripe is disabled in local mock mode.')
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is required.')
  return (client ??= new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true }))
}
