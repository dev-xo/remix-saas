import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

interface GetUserByIdParams {
	id: User['id']
	include?: Prisma.UserInclude
}

export async function getUserById({ id, include }: GetUserByIdParams) {
	return db.user.findUnique({
		where: { id },
		include: {
			password: include?.password || false,
			subscription: include?.password || false,

			...include,
		},
	})
}
