import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Utils.
 * @required Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

const HOST_URL =
	process.env.NODE_ENV === 'development'
		? process.env.DEV_HOST_URL
		: process.env.PROD_HOST_URL

export const createStripeCustomerPortalSession = async (
	customerId: Subscription['customerId'],
) => {
	// Creates a Customer Portal Session object.
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${HOST_URL}/resources/stripe/create-customer-portal/update-session`,
	})

	if (!session?.url)
		throw new Error('Unable to create a new Stripe Customer Portal Session.')

	// Returns newly created Stripe Customer Portal Session URL.
	return session.url
}
