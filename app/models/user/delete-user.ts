import type { Prisma, User } from '@prisma/client'
import { db } from '~/lib/db'

export async function deleteUser(id: User['id'], include?: Prisma.UserInclude) {
	return db.user.delete({
		where: { id },
		include: {
			password: include?.password || false,
			subscription: include?.subscription || false,

			...include,
		},
	})
}
