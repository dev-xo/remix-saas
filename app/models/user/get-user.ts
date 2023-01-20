import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

export async function getUserById(id: User['id'], include?: Prisma.UserInclude) {
	return db.user.findUnique({
		where: { id },
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}

export async function getUserByEmail(
	email: User['email'],
	include?: Prisma.UserInclude,
) {
	if (typeof email !== 'string') throw new Error('Invalid email.')

	return db.user.findUnique({
		where: { email },
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}
