import type { Subscription } from '@prisma/client'
import { db } from '~/utils/db.server'

/**
 * Mutations.
 */
export async function createSubscription(
	subscription: Omit<Subscription, 'id'>,
) {
	return db.subscription.create({ data: subscription })
}

export async function updateSubscription(
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
) {
	if (typeof customerId === 'string')
		return db.subscription.update({
			where: { customerId },
			data: { ...subscription },
		})
}

/**
 * Queries.
 */
export async function getSubscriptionByCustomerId(
	customerId: Subscription['customerId'],
) {
	if (typeof customerId === 'string')
		return db.subscription.findUnique({ where: { customerId } })
}
