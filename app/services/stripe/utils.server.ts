import type { Subscription } from '@prisma/client'
import { getDomainUrl } from '~/utils/misc.server'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
	apiVersion: '2022-08-01',
	typescript: true,
})

export async function createStripeCustomer(
	customer: Stripe.CustomerCreateParams,
) {
	return stripe.customers.create(customer)
}

export async function deleteStripeCustomer(
	customerId: Subscription['customerId'],
) {
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
