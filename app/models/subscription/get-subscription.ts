import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export async function getSubscriptionByCustomerId(
	customerId: Subscription['customerId'],
	include?: Prisma.SubscriptionInclude,
) {
	if (typeof customerId !== 'string') throw new Error('Invalid customerId.')

	return db.subscription.findUnique({
		where: { customerId },
		include: {
			user: include?.user || false,
			...include,
		},
	})
}
