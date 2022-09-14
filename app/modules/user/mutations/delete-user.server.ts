import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const deleteUser = async (providerId: User['providerId']) =>
	db.user.delete({ where: { providerId } })
