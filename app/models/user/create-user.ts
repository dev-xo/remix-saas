import type { Prisma, User, Password } from '@prisma/client'
import { db } from '~/lib/db'

interface CreateEmailUserParams {
	user: Pick<User, 'name' | 'email' | 'avatar'>
	hashedPassword: Password['hash']
	include?: Prisma.UserInclude
}

export async function createEmailUser({
	user,
	hashedPassword,
	include,
}: CreateEmailUserParams) {
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

interface CreateSocialUserParams {
	user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>
	include?: Prisma.UserInclude
}

export async function createSocialUser({ user, include }: CreateSocialUserParams) {
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
