import type { User } from '@prisma/client'
import { db } from '~/utils'

/**
 * Mutations.
 * @protected Template code.
 */
export const createUser = async (
	user: Pick<User, 'providerId' | 'email' | 'name' | 'avatar'>,
) => {
	try {
		return await db.user.create({ data: user })
	} catch (err: unknown) {
		console.log(err)
		return null
	}
}
