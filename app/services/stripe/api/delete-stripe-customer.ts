import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

interface DeleteStripeCustomerParams {
	customerId?: Subscription['customerId']
	params?: Stripe.CustomerDeleteParams
	options?: Stripe.RequestOptions
}

export async function deleteStripeCustomer({
	customerId,
	params,
	options,
}: DeleteStripeCustomerParams) {
	if (typeof customerId === 'string') {
		return stripe.customers.del(customerId, params, options)
	}
}
