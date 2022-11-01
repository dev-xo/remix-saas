import type { User } from '@prisma/client'
import type { Password } from '@prisma/client'
import { db } from '~/utils/db.server'

/**
 * Mutations.
 * @required Template code.
 */
export const createSocialUser = async (
	user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>,
) => {
	return db.user.create({ data: user })
}

export const createEmailUser = async ({
	user,
	password,
}: {
	user: Pick<User, 'email' | 'name' | 'avatar'>
	password: Password['hash']
}) => {
	return db.user.create({
		data: {
			...user,
			password: {
				create: {
					hash: password,
				},
			},
		},
	})
}

export const deleteUser = async (id: User['id']) => {
	return db.user.delete({ where: { id } })
}

export const resetUserPassword = async ({
	email,
	hashedPassword,
}: {
	email: User['email']
	hashedPassword: Password['hash']
}) => {
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
 * @required Template code.
 */
export const getUserByIdIncludingSubscription = async (id: User['id']) => {
	if (typeof id === 'string')
		return db.user.findUnique({
			where: { id },
			include: {
				subscription: true,
			},
		})
}

export const getUserByEmail = async (email: User['email']) => {
	if (typeof email === 'string')
		return db.user.findUnique({
			where: { email },
		})
}

export const getUserByEmailIncludingSubscriptionAndPassword = async (
	email: User['email'],
) => {
	if (typeof email === 'string')
		return db.user.findUnique({
			where: { email },
			include: {
				subscription: true,
				password: true,
			},
		})
}

export const getUserByEmailIncludingPassword = async (email: User['email']) => {
	if (typeof email === 'string')
		return db.user.findUnique({
			where: { email },
			include: {
				password: true,
			},
		})
}
