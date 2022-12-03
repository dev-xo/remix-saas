import type { ActionArgs } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { authenticator } from '~/lib/auth/config.server'
import { getUserById } from '~/lib/models/user'
import { createSubscription } from '~/lib/models/subscription'
import {
	createStripeCheckoutSession,
	createStripeCustomer,
} from '~/lib/stripe/utils'

export async function action({ request }: ActionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Gets values from `formData`.
	const formData = await request.formData()
	const { planId } = Object.fromEntries(formData)

	if (typeof planId !== 'string')
		throw new Error('TypeError: `planId` should be a string.')

	// On `customerId` in Session:
	if (user.subscription?.customerId) {
		const customerId = user.subscription.customerId
		const stripeRedirectUrl = await createStripeCheckoutSession(
			request,
			customerId,
			planId,
		)

		// Redirects to checkout with Customer already set.
		return redirect(stripeRedirectUrl)
	}

	// On `customerId` not in Session:
	if (!user.subscription?.customerId) {
		// Checks for user existence in database.
		const dbUser = await getUserById({
			id: user.id,
			include: {
				subscription: true,
			},
		})

		// On `customerId` found in database:
		if (dbUser && dbUser.subscription?.customerId) {
			const customerId = dbUser.subscription.customerId
			const stripeRedirectUrl = await createStripeCheckoutSession(
				request,
				customerId,
				planId,
			)

			// Redirects to checkout with Customer already set.
			return redirect(stripeRedirectUrl)
		}

		// On `customerId` not found in database:
		if (dbUser && !dbUser.subscription?.customerId) {
			// Creates a new Stripe Customer.
			const newStripeCustomer = await createStripeCustomer({
				email: user.email ? user.email : '',
				name: user.name ? user.name : undefined,
			})
			if (!newStripeCustomer)
				throw new Error('There was an Error trying to create a new Stripe Customer.')

			// Stores newly created Customer into database.
			const newSubscription = await createSubscription({
				userId: user.id,
				customerId: newStripeCustomer.id,
				subscriptionId: null,
				planId: null,
				status: null,
				currentPeriodStart: null,
				currentPeriodEnd: null,
				cancelAtPeriodEnd: null,
			})
			if (!newSubscription)
				throw new Error('There was an Error trying to create a new Subscription.')

			const customerId = newStripeCustomer.id
			const stripeRedirectUrl = await createStripeCheckoutSession(
				request,
				customerId,
				planId,
			)

			// Redirects to checkout with Customer already set.
			return redirect(stripeRedirectUrl)
		}
	}

	// Whops!
	return json({}, { status: 400 })
}

export default function CreateCheckoutSessionResource() {
	return <div>Whops! You should have been redirected.</div>
}
