import Stripe from 'stripe'

/**
 * Mutations.
 * @protected Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2022-08-01',
})

export const createStripeCustomer = async (
	customer: Stripe.CustomerCreateParams,
) => {
	try {
		return await stripe.customers.create(customer)
	} catch (err: unknown) {
		console.log(err)
		return null
	}
}
