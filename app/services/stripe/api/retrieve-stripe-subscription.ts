import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function retrieveStripeSubscription(
	subscriptionId?: Subscription['subscriptionId'],
	params?: Stripe.SubscriptionRetrieveParams,
) {
	if (typeof subscriptionId === 'string') {
		return stripe.subscriptions.retrieve(subscriptionId, params)
	}
}
