import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Queries.
 * @protected Template code.
 */
export const getUserByProviderId = async (providerId: User['providerId']) => {
	try {
		return await db.user.findUnique({ where: { providerId } })
	} catch (err: any) {
		console.log(err)
		return null
	}
}

export const getUserByProviderIdIncludingSubscription = async (
	providerId: User['providerId'],
) => {
	try {
		return await db.user.findUnique({
			where: { providerId },
			include: {
				subscription: true,
			},
		})
	} catch (err: any) {
		console.log(err)
		return null
	}
}
