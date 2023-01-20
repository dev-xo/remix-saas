import type { Subscription } from '@prisma/client'

import { stripe } from '~/services/stripe/config.server'
import { getDomainUrl } from '~/lib/utils/http'

export async function createStripeCheckoutSession(
	customerId: Subscription['customerId'],
	planId: Subscription['planId'],
	request: Request,
) {
	if (!customerId || !planId)
		throw new Error(
			'Unable to create Stripe Checkout Session. Missing `customerId` or `planId`.',
		)

	// Creates a Checkout Session object.
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		line_items: [{ price: planId, quantity: 1 }],
		mode: 'subscription',
		payment_method_types: ['card'],
		success_url: `${getDomainUrl(request)}/checkout?success=true`,
		cancel_url: `${getDomainUrl(request)}/checkout?cancel=true`,
	})
	if (!session?.url) throw new Error('Unable to create Stripe Checkout Session.')

	// Returns newly created Checkout Session as URL.
	return session.url
}
