import type { Subscription } from '@prisma/client'
import type { StripePlan } from '~/lib/stripe/plans'
import type { Stripe } from 'stripe'

import { stripe } from './config.server'
import { STRIPE_PLANS } from '~/lib/stripe/plans'
import { getDomainUrl } from '~/lib/utils'

/**
 * Plans Utils.
 */
export function getStripePlanValue(
	planId: StripePlan['planId'],
	value: keyof StripePlan,
) {
	return STRIPE_PLANS.find((plan) => plan.planId === planId)?.[value]
}

/**
 * API Utils.
 */
export async function createStripeCustomer(customer: Stripe.CustomerCreateParams) {
	return stripe.customers.create(customer)
}

export async function retrieveStripeCustomer(
	customerId: Subscription['customerId'],
) {
	if (typeof customerId === 'string') {
		try {
			return await stripe.customers.retrieve(customerId)
		} catch (err: unknown) {
			console.log(err)
			return null
		}
	}
}

export async function deleteStripeCustomer(customerId: Subscription['customerId']) {
	if (typeof customerId === 'string') return stripe.customers.del(customerId)
}

export async function updateStripeSubscription(
	subscriptionId: Subscription['subscriptionId'],
	params: Stripe.SubscriptionUpdateParams = {},
) {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.update(subscriptionId, {
			...params,
		})
}

export async function retrieveStripeSubscription(
	subscriptionId: Subscription['subscriptionId'],
) {
	if (typeof subscriptionId === 'string')
		return stripe.subscriptions.retrieve(subscriptionId)
}

export async function createStripeCheckoutSession(
	request: Request,
	customerId: Subscription['customerId'],
	priceId: Subscription['planId'],
) {
	if (!customerId || !priceId)
		throw new Error('Stripe `customerId` or `priceId` are undefined.')

	// Creates a Checkout Session object.
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

	// Returns newly created Checkout Session as URL.
	return session.url
}

export async function createStripeCustomerPortalSession(
	request: Request,
	customerId: Subscription['customerId'],
) {
	if (!customerId) throw new Error('`customerId` is undefined.')

	// Creates a Customer Portal Session object.
	const session = await stripe.billingPortal.sessions.create({
		customer: customerId,
		return_url: `${getDomainUrl(request)}/stripe/create-customer-portal`,
	})

	if (!session?.url)
		throw new Error('Unable to create a new Stripe Customer Portal Session.')

	// Returns newly created Customer Portal Session as URL.
	return session.url
}
