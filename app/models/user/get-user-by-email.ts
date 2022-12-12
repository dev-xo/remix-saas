import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

interface GetUserByEmailParams {
	email: User['email']
	include?: Prisma.UserInclude
}

export async function getUserByEmail({ email, include }: GetUserByEmailParams) {
	if (typeof email !== 'string') throw new Error('Email has to be a string.')

	return db.user.findUnique({
		where: { email },
		include: {
			password: include?.password || false,
			subscription: include?.password || false,

			...include,
		},
	})
}
