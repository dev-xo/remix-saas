import Stripe from 'stripe'

import type { Subscription } from '@prisma/client'
import type { StripePlan } from './stripe-plans'

import { getDomainUrl } from '~/utils/misc.server'
import { STRIPE_PLANS } from './stripe-plans'

/**
 * Utils.
 * @required Template code.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
	apiVersion: '2022-08-01',
})

/**
 * Creates a Stripe Customer.
 */
export const createStripeCustomer = async (
	customer: Stripe.CustomerCreateParams,
) => {
	return stripe.customers.create(customer)
}

/**
 * Deletes a Stripe Customer.
 */
export const deleteStripeCustomer = async (
	customerId: Subscription['customerId'],
) => {
	if (typeof customerId === 'string') return stripe.customers.del(customerId)
}

/**
 * Updates a Stripe Customer.
 */
export const updateStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
	params: Stripe.SubscriptionUpdateParams = {},
) => {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.update(subscriptionId, {
			...params,
		})
}

/**
 * Retrieves a Stripe Subscription.
 */
export const retrieveStripeSubscription = async (
	subscriptionId: Subscription['subscriptionId'],
) => {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.retrieve(subscriptionId)
}

/**
 * Creates a Stripe Checkout Session.
 */
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
		success_url: `${getDomainUrl(request)}/checkout`,
		cancel_url: `${getDomainUrl(request)}/checkout/cancel`,
	})

	if (!session?.url)
		throw new Error('Unable to create a new Stripe Checkout Session.')

	/**
	 * Returns newly created Checkout Session as URL.
	 */
	return session.url
}

/**
 * Creates a Stripe Customer Portal Session.
 */
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

/**
 * Gets a value from `STRIPE_PLANS` based on `planId`.
 */
export const getValueFromStripePlans = (
	planId: StripePlan['planId'],
	value: keyof StripePlan,
) => STRIPE_PLANS.find((plan) => plan.planId === planId)?.[value]
