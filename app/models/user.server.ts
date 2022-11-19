import type { Prisma, User, Password } from '@prisma/client';
import { db } from '~/utils/db.server';

/**
 * Mutations.
 */
export const createSocialUser = async (
	user: Pick<User, 'id' | 'email' | 'name' | 'avatar'>,
) => {
	return db.user.create({ data: user });
};

export const createEmailUser = async ({
	user,
	hashedPassword,
}: {
	user: Pick<User, 'name' | 'email' | 'avatar'>;
	hashedPassword: Password['hash'];
}) => {
	return db.user.create({
		data: {
			...user,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});
};

export const deleteUser = async (id: User['id']) => {
	return db.user.delete({ where: { id } });
};

export const updateUserPassword = async ({
	email,
	hashedPassword,
}: {
	email: User['email'];
	hashedPassword: Password['hash'];
}) => {
	if (typeof email !== 'string')
		throw new Error('Typeof email should be string.');

	return db.user.update({
		where: { email },
		data: {
			password: {
				update: {
					hash: hashedPassword,
				},
			},
		},
	});
};

/**
 * Queries.
 */
export const getUserById = async ({
	id,
	include,
}: {
	id: User['id'];
	include?: Prisma.UserInclude;
}) => {
	return db.user.findUnique({
		where: { id },
		include: {
			password: include?.password,
			subscription: include?.subscription,
		},
	});
};

export const getUserByEmail = async ({
	email,
	include,
}: {
	email: User['email'];
	include?: Prisma.UserInclude;
}) => {
	if (typeof email !== 'string')
		throw new Error('Typeof email should be string.');

	return db.user.findUnique({
		where: { email },
		include: {
			password: include?.password,
			subscription: include?.subscription,
		},
	});
};
