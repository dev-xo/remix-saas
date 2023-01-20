import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export async function createSubscription(
	subscription: Omit<Subscription, 'id'>,
	include?: Prisma.SubscriptionInclude,
) {
	return db.subscription.create({
		data: {
			...subscription,
		},
		include: {
			user: include?.user || false,
			...include,
		},
	})
}
