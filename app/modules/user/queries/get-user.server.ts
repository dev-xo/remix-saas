import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @required Template code.
 */
export const getUserByProviderId = async (providerId: User['providerId']) => {
	return db.user.findUnique({ where: { providerId } })
}

export const getUserByProviderIdIncludingSubscription = async (
	providerId: User['providerId'],
) => {
	return db.user.findUnique({
		where: { providerId },
		include: {
			subscription: true,
		},
	})
}
