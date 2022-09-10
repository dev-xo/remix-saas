import type { Subscription } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const createSubscription = async (
	subscription: Omit<Subscription, 'id'>,
) => {
	try {
		return await db.subscription.create({ data: subscription })
	} catch (err: any) {
		console.log(err)
		return null
	}
}
