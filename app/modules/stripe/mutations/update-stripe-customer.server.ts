import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const updateStripeCustomer = async (
	customerId: Subscription['customerId'],
	params: Stripe.SubscriptionUpdateParams = {},
) => {
	try {
		return await stripe.customers.update(customerId, {
			...params,
		})
	} catch (err: any) {
		console.log(err)
		return null
	}
}
