import type { Prisma, User, Password } from '@prisma/client'
import { db } from '~/lib/db'

export async function createEmailUser(
	user: Pick<User, 'name' | 'email' | 'avatar'>,
	hashedPassword: Password['hash'],
	include?: Prisma.UserInclude,
) {
	return db.user.create({
		data: {
			...user,
			password: {
				create: {
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

export async function createSocialUser(
	user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>,
	include?: Prisma.UserInclude,
) {
	return db.user.create({
		data: {
			...user,
		},
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}
