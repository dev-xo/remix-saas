import type { User } from '@prisma/client'

import { PrismaClient } from '@prisma/client'
import { db } from '~/lib/db'

import bcrypt from 'bcryptjs'

/**
 * Seeds Database.
 */
const prisma = new PrismaClient()

const seed = async () => {
	// Mocks testing Playwright user.
	const playwrightUser: Pick<User, 'name' | 'email' | 'avatar'> = {
		name: 'Playwright',
		email: 'playwright@test.com',
		avatar: 'https://ui-avatars.com/api/?&name=Playwright&background=random',
	}
	const playwrightUserPassword = 'password'

	// Stores newly Playwright user into database.
	const newPlaywrightUser = await db.user.create({
		data: {
			...playwrightUser,
			password: {
				create: {
					hash: bcrypt.hashSync(playwrightUserPassword, 10),
				},
			},
		},
	})
	if (!newPlaywrightUser) throw new Error('Unable to create a Playwright test user.')

	return true
}

seed()
	.catch((e: unknown) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
