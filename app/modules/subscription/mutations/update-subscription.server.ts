import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const updateSubscription = async (
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
) => {
	try {
		return await db.subscription.update({
			where: { customerId },
			data: { ...subscription },
		})
	} catch (err: any) {
		/**
		 * This avoids getting the following error message from database:
		 * "An operation failed because it depends on one or more records
		 * that were required but not found."

		 * Nothing important, just clearing console errors.
		 */
		if (err.meta.cause === 'Record to update not found.') return false

		console.log(err)
		return null
	}
}
