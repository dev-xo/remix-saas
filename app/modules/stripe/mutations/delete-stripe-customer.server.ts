import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const deleteStripeCustomer = async (
	customerId: Subscription['customerId'],
) => {
	try {
		return await stripe.customers.del(customerId)
	} catch (err: any) {
		console.log(err)
		return null
	}
}
