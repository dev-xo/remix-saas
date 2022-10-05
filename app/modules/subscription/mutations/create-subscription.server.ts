import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @required Template code.
 */
export const createSubscription = async (
	subscription: Omit<Subscription, 'id'>,
) => {
	return db.subscription.create({ data: subscription })
}
