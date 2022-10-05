import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @required Template code.
 */
export const updateSubscription = async (
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
) => {
	return db.subscription.update({
		where: { customerId },
		data: { ...subscription },
	})
}
