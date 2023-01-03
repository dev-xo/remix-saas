import type { Subscription } from '@prisma/client'
import type { Stripe } from 'stripe'

import { stripe } from '~/services/stripe/config.server'
import { getDomainUrl } from '~/lib/utils/http'

interface CreateStripeCustomerPortalSessionParams {
	customerId: Subscription['customerId']

	request: Request
	params?: Stripe.BillingPortal.SessionCreateParams
	options?: Stripe.RequestOptions
}

export async function createStripeCustomerPortalSession({
	customerId,
	request,
	params,
	options,
}: CreateStripeCustomerPortalSessionParams) {
	if (!customerId)
		throw new Error(
			'customerId is required to create a Stripe Customer Portal Session.',
		)

	// Creates a Customer Portal Session object.
	const session = await stripe.billingPortal.sessions.create(
		{
			...params,
			customer: customerId,
			return_url: `${getDomainUrl(request)}/resources/stripe/create-customer-portal`,
		},
		options,
	)

	if (!session?.url)
		throw new Error('Unable to create Stripe Customer Portal Session.')

	// Returns newly created Customer Portal Session as URL.
	return session.url
}
