import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const deleteUser = async (providerId: User['providerId']) => {
	try {
		return await db.user.delete({ where: { providerId } })
	} catch (err: any) {
		console.log(err)
		return false
	}
}
