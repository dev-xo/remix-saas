import type { Subscription } from '@prisma/client'
import { getDomainUrl } from '~/utils/misc.server'
import Stripe from 'stripe'

/**
 * Utils.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
	apiVersion: '2022-08-01',
})

export const createStripeCustomer = async (
	customer: Stripe.CustomerCreateParams,
) => {
	return stripe.customers.create(customer)
}

export const deleteStripeCustomer = async (
	customerId: Subscription['customerId'],
) => {
	if (typeof customerId === 'string') return stripe.customers.del(customerId)
}

export const updateStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
	params: Stripe.SubscriptionUpdateParams = {},
) => {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.update(subscriptionId, {
			...params,
		})
}

export const retrieveStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
) => {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.retrieve(subscriptionId)
}

export const createStripeCheckoutSession = async (
	request: Request,
	customerId: Subscription['customerId'],
	priceId: Subscription['planId'],
) => {
	if (!customerId || !priceId)
		throw new Error('Stripe `customerId` or `priceId` are undefined.')

	/**
	 * Creates a Checkout Session object.
	 */
	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		line_items: [{ price: priceId, quantity: 1 }],
		mode: 'subscription',
		payment_method_types: ['card'],
		success_url: `${getDomainUrl(request)}/checkout?success=true`,
		cancel_url: `${getDomainUrl(request)}/checkout?cancel=true`,
	})

	if (!session?.url)
		throw new Error('Unable to create a new Stripe Checkout Session.')

	/**
	 * Returns newly created Checkout Session as URL.
	 */
	return session.url
}

export const createStripeCustomerPortalSession = async (
	request: Request,
	customerId: Subscription['customerId'],
) => {
	if (!customerId) throw new Error('`customerId` is undefined.')

	/**
	 * Creates a Customer Portal Session object.
	 */
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${getDomainUrl(
			request,
		)}/resources/stripe/create-customer-portal/update-session`,
	})

	if (!session?.url)
		throw new Error('Unable to create a new Stripe Customer Portal Session.')

	/**
	 * Returns newly created Customer Portal Session as URL.
	 */
	return session.url
}
