import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

interface DeleteUserParams {
	id: User['id']
	include?: Prisma.UserInclude
}

export async function deleteUser({ id, include }: DeleteUserParams) {
	return db.user.delete({
		where: { id },
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}
