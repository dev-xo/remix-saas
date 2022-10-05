import Stripe from 'stripe'

/**
 * Mutations.
 * @required Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const createStripeCustomer = async (
	customer: Stripe.CustomerCreateParams,
) => {
	return stripe.customers.create(customer)
}
