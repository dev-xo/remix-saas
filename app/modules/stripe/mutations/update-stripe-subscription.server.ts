import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const updateStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
	params: Stripe.SubscriptionUpdateParams = {},
) => {
	try {
		if (typeof subscriptionId === 'string')
			return await stripe.subscriptions.update(subscriptionId, {
				...params,
			})
	} catch (err: any) {
		console.log(err)
		return null
	}
}
