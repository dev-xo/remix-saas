import Stripe from 'stripe'

/**
 * Inits Stripe.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
	apiVersion: '2022-11-15',
	typescript: true,
})
