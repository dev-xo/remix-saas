import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 *
 * Returns a Stripe Checkout Session URL.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const createStripeCheckoutSession = async (
	customerId: Subscription['customerId'],
	priceId: string,
) => {
	const HOST_URL =
		process.env.NODE_ENV === 'development'
			? process.env.DEV_HOST_URL
			: process.env.PROD_HOST_URL

	try {
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [{ price: priceId, quantity: 1 }],
			mode: 'subscription',
			payment_method_types: ['card'],
			success_url: `${HOST_URL}/resources/stripe/create-checkout-session/update-session`,
			cancel_url: `${HOST_URL}/resources/stripe/create-checkout-session/update-session`,
		})

		/**
		 * Returns a Stripe Checkout Session URL.
		 */
		if (session) return session.url

		/**
		 * If there is no Session, throws an Error.
		 */
		throw new Error('Unable to create a Checkout Session.')
	} catch (err: unknown) {
		console.log(err)
		return null
	}
}
