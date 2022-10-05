import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @required Template code.
 */
export const getSubscriptionByCustomerId = async (
	customerId: Subscription['customerId'],
) => {
	return db.subscription.findUnique({ where: { customerId } })
}
