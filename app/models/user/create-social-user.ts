import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

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
			subscription: include?.password || false,

			...include,
		},
	})
}
