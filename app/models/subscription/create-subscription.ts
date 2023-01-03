import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export interface CreateSubscriptionParams {
	subscription: Omit<Subscription, 'id'>
	include?: Prisma.SubscriptionInclude
}

export async function createSubscription({
	subscription,
	include,
}: CreateSubscriptionParams) {
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
