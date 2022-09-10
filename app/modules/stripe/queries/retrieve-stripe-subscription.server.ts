import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Queries.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const retrieveStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
) => {
	try {
		if (typeof subscriptionId === 'string')
			return await stripe.subscriptions.retrieve(subscriptionId)
	} catch (err: any) {
		console.log(err)
		return null
	}
}
