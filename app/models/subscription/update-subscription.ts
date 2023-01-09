import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export async function updateSubscription(
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
	include?: Prisma.SubscriptionInclude,
) {
	if (typeof customerId !== 'string') throw new Error('Invalid customerId.')

	return db.subscription.update({
		where: { customerId },
		data: { ...subscription },
		include: {
			user: include?.user || false,
			...include,
		},
	})
}
