import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

interface CreateStripeCustomerParams {
	customer?: Stripe.CustomerCreateParams
	options?: Stripe.RequestOptions
}

export async function createStripeCustomer({
	customer,
	options,
}: CreateStripeCustomerParams) {
	return stripe.customers.create(customer, options)
}
