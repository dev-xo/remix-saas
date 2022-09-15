import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const createUser = async (
	user: Pick<User, 'providerId' | 'email' | 'name' | 'avatar'>,
) => db.user.create({ data: user })
