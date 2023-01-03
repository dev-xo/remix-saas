import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'

import { stripe } from '~/services/stripe/config.server'

interface UpdateStripeSubscriptionParams {
	subscriptionId?: Subscription['subscriptionId']
	params?: Stripe.SubscriptionUpdateParams
	options?: Stripe.RequestOptions
}

export async function updateStripeSubscription({
	subscriptionId,
	params,
	options,
}: UpdateStripeSubscriptionParams) {
	if (typeof subscriptionId === 'string') {
		return stripe.subscriptions.update(subscriptionId, params, options)
	}
}
