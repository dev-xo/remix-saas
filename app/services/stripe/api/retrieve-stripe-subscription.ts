import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'

import { stripe } from '~/services/stripe/config.server'

interface RetrieveStripeSubscriptionParams {
	subscriptionId?: Subscription['subscriptionId']
	params?: Stripe.SubscriptionRetrieveParams
	options?: Stripe.RequestOptions
}

export async function retrieveStripeSubscription({
	subscriptionId,
	params,
	options,
}: RetrieveStripeSubscriptionParams) {
	if (typeof subscriptionId === 'string') {
		return stripe.subscriptions.retrieve(subscriptionId, params, options)
	}
}
