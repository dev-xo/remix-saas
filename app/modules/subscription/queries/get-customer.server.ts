import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @protected Template code.
 */
export const getByCustomerId = async (
	customerId: Subscription['customerId'],
) => {
	return db.subscription.findUnique({ where: { customerId } })
}
