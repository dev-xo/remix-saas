import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function createStripeCustomer(customer?: Stripe.CustomerCreateParams) {
	return stripe.customers.create(customer)
}
