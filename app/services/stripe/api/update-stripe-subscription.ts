import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'
import { stripe } from '~/services/stripe/config.server'

export async function updateStripeSubscription(
	subscriptionId?: Subscription['subscriptionId'],
	params?: Stripe.SubscriptionUpdateParams,
) {
	if (typeof subscriptionId === 'string') {
		return stripe.subscriptions.update(subscriptionId, params)
	}
}
