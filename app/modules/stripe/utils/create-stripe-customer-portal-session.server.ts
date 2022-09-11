import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 *
 * Returns a Stripe Customer Portal Session URL.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const createStripeCustomerPortalSession = async (
	customerId: Subscription['customerId'],
) => {
	const HOST_URL =
		process.env.NODE_ENV === 'development'
			? process.env.DEV_HOST_URL
			: process.env.PROD_HOST_URL

	try {
		const session = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: `${HOST_URL}/resources/stripe/create-customer-portal/update-session`,
		})

		/**
		 * Returns a Stripe Customer Portal Session URL.
		 */
		if (session) return session.url

		/**
		 * If there is no Session, throws an Error.
		 */
		throw new Error('Unable to create a Billing Portal Session.')
	} catch (err: unknown) {
		console.log(err)
		return null
	}
}
