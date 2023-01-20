import type { Prisma, User, Password } from '@prisma/client'
import { db } from '~/lib/db'

export async function updateUserPassword(
	email: User['email'],
	hashedPassword: Password['hash'],
	include?: Prisma.UserInclude,
) {
	if (typeof email !== 'string') throw new Error('Invalid email.')

	return db.user.update({
		where: { email },
		data: {
			password: {
				update: {
					hash: hashedPassword,
				},
			},
		},
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}
