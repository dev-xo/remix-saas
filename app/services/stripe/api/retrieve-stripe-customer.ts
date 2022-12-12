import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

interface RetrieveStripeCustomerParams {
	customerId?: Subscription['customerId']
	params?: Stripe.CustomerRetrieveParams
	options?: Stripe.RequestOptions
}

export async function retrieveStripeCustomer({
	customerId,
	params,
	options,
}: RetrieveStripeCustomerParams) {
	if (typeof customerId === 'string') {
		return await stripe.customers.retrieve(customerId, params, options)
	}
}
