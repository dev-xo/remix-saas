import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function deleteStripeCustomer(
	customerId?: Subscription['customerId'],
	params?: Stripe.CustomerDeleteParams,
) {
	if (typeof customerId === 'string') {
		return stripe.customers.del(customerId, params)
	}
}
