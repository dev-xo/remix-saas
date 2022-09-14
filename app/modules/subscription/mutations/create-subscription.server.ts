import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const createSubscription = async (
	subscription: Omit<Subscription, 'id'>,
) => db.subscription.create({ data: subscription })
