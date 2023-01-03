import type { Prisma } from '@prisma/client'
import type { Subscription } from '@prisma/client'
import { db } from '~/lib/db'

export interface GetSubscriptionByCustomerIdParams {
	customerId: Subscription['customerId']
	include?: Prisma.SubscriptionInclude
}

export async function getSubscriptionByCustomerId({
	customerId,
	include,
}: GetSubscriptionByCustomerIdParams) {
	if (typeof customerId !== 'string') throw new Error('customerId must be a string.')

	return db.subscription.findUnique({
		where: { customerId },
		include: {
			user: include?.user || false,
			...include,
		},
	})
}
