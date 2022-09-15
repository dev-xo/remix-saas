import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Queries.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const retrieveStripeCustomer = async (
	customerId: Subscription['customerId'],
) => stripe.customers.retrieve(customerId)
