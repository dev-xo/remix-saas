import type { Prisma, User, Password } from '@prisma/client'
import { db } from '~/utils/db.server'

/**
 * Mutations.
 */
export async function createSocialUser(
	user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>,
) {
	return db.user.create({ data: user })
}

export async function createEmailUser({
	user,
	hashedPassword,
}: {
	user: Pick<User, 'name' | 'email' | 'avatar'>
	hashedPassword: Password['hash']
}) {
	return db.user.create({
		data: {
			...user,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	})
}

export async function deleteUser(id: User['id']) {
	return db.user.delete({ where: { id } })
}

export async function updateUserPassword({
	email,
	hashedPassword,
}: {
	email: User['email']
	hashedPassword: Password['hash']
}) {
	if (typeof email === 'string')
		return db.user.update({
			where: { email },
			data: {
				password: {
					update: {
						hash: hashedPassword,
					},
				},
			},
		})
}

/**
 * Queries.
 */
export async function getUserById({
	id,
	include,
}: {
	id: User['id']
	include?: Prisma.UserInclude
}) {
	return db.user.findUnique({
		where: { id },
		include: {
			password: include?.password,
			subscription: include?.subscription,
		},
	})
}

export async function getUserByEmail({
	email,
	include,
}: {
	email: User['email']
	include?: Prisma.UserInclude
}) {
	if (typeof email === 'string')
		return db.user.findUnique({
			where: { email },
			include: {
				password: include?.password,
				subscription: include?.subscription,
			},
		})
}
