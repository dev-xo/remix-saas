import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @protected Template code.
 */
export const getUserByProviderId = async (providerId: User['providerId']) =>
	db.user.findUnique({ where: { providerId } })

export const getUserByProviderIdIncludingSubscription = async (
	providerId: User['providerId'],
) =>
	db.user.findUnique({
		where: { providerId },
		include: {
			subscription: true,
		},
	})
