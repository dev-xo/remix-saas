import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @required Template code.
 */
export const createUser = async (
	user: Pick<User, 'providerId' | 'email' | 'name' | 'avatar'>,
) => {
	return db.user.create({ data: user })
}
