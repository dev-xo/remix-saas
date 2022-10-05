import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Queries.
 * @required Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const retrieveStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
) => {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.retrieve(subscriptionId)
}
