import type { Subscription } from '@prisma/client'

import { stripe } from '~/services/stripe/config.server'
import { getDomainUrl } from '~/lib/utils/http'

export async function createStripeCustomerPortalSession(
	customerId: Subscription['customerId'],
	request: Request,
) {
	if (!customerId)
		throw new Error(
			'Unable to create Stripe Customer Portal Session. Missing `customerId`.',
		)

	// Creates a Customer Portal Session object.
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${getDomainUrl(request)}/resources/stripe/create-customer-portal`,
	})

	if (!session?.url)
		throw new Error('Unable to create Stripe Customer Portal Session.')

	// Returns newly created Customer Portal Session as URL.
	return session.url
}
