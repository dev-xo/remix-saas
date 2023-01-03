import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export interface UpdateSubscriptionParams {
	customerId: Subscription['customerId']
	subscription: Partial<Subscription>
	include?: Prisma.SubscriptionInclude
}

export async function updateSubscription({
	customerId,
	subscription,
	include,
}: UpdateSubscriptionParams) {
	if (typeof customerId !== 'string') throw new Error('customerId must be a string.')

	return db.subscription.update({
		where: { customerId },
		data: { ...subscription },
		include: {
			user: include?.user || false,
			...include,
		},
	})
}
