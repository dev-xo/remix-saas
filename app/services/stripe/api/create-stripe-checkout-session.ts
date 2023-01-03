import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'

import { stripe } from '~/services/stripe/config.server'
import { getDomainUrl } from '~/lib/utils/http'

interface CreateStripeCheckoutParams {
	customerId: Subscription['customerId']
	planId: Subscription['planId']

	request: Request
	params?: Stripe.Checkout.SessionCreateParams
	options?: Stripe.RequestOptions
}

export async function createStripeCheckoutSession({
	customerId,
	planId,
	request,
	params,
	options,
}: CreateStripeCheckoutParams) {
	if (!customerId || !planId)
		throw new Error(
			'customerId and planId are required to create a Stripe Checkout Session.',
		)

	// Creates a Checkout Session object.
	const session = await stripe.checkout.sessions.create(
		{
			...params,
			customer: customerId,
			line_items: [{ price: planId, quantity: 1 }],
			mode: 'subscription',
			payment_method_types: ['card'],
			success_url: `${getDomainUrl(request)}/checkout?success=true`,
			cancel_url: `${getDomainUrl(request)}/checkout?cancel=true`,
		},
		options,
	)
	if (!session?.url) throw new Error('Unable to create Stripe Checkout Session.')

	// Returns newly created Checkout Session as URL.
	return session.url
}
