import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const updateSubscription = async (
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
) =>
	db.subscription.update({
		where: { customerId },
		data: { ...subscription },
	})
