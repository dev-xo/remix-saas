import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @protected Template code.
 */
export const getByCustomerId = async (
	customerId: Subscription['customerId'],
) => {
	try {
		return await db.subscription.findUnique({ where: { customerId } })
	} catch (err: any) {
		console.log(err)
		return null
	}
}
