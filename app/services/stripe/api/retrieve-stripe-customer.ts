import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function retrieveStripeCustomer(
	customerId?: Subscription['customerId'],
	params?: Stripe.CustomerRetrieveParams,
) {
	if (typeof customerId === 'string') {
		return await stripe.customers.retrieve(customerId, params)
	}
}
