import type { Subscription } from '@prisma/client'
import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 *
 * Returns a new Stripe Checkout Session URL.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

const HOST_URL =
	process.env.NODE_ENV === 'development'
		? process.env.DEV_HOST_URL
		: process.env.PROD_HOST_URL

export const createStripeCheckoutSession = async (
	customerId: Subscription['customerId'],
	priceId: Subscription['planId'],
) => {
	try {
		if (!priceId) throw new Error('Stripe `priceId` is undefined.')

		/**
		 * Creates a Checkout Session object.
		 */
		const session = await stripe.checkout.sessions.create({
			customer: customerId,
			line_items: [{ price: priceId, quantity: 1 }],
			mode: 'subscription',
			payment_method_types: ['card'],
			success_url: `${HOST_URL}/resources/stripe/create-checkout-session/update-session`,
			cancel_url: `${HOST_URL}/resources/stripe/create-checkout-session/update-session`,
		})

		if (!session?.url)
			throw new Error('Unable to create a new Stripe Checkout Session.')

		/**
		 * Returns a new Stripe Checkout Session URL.
		 */
		return session.url
	} catch (err: unknown) {
		console.log(err)
		return null
	}
}
