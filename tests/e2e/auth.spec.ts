/* eslint-disable testing-library/prefer-screen-queries */

import type { User } from '@prisma/client'

import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { createEmailUser } from '~/models/user.server'
import { createFakeEmailUser } from '../utils'
import { hashPassword } from '~/services/auth/utils.server'

test.describe('Login - Login with Email', async () => {
	/**
	 * Creates a fake user.
	 */
	const fakeUsers = new Set<User>()
	const fakeUser = createFakeEmailUser()
	const fakeUserPassword = 'password'

	/**
	 * Uses a clean context with given storage state.
	 */
	test.use({ storageState: { cookies: [], origins: [] } })

	/**
	 * Stores newly created user into database.
	 */
	test.beforeEach(async () => {
		const newFakeUser = await createEmailUser({
			user: fakeUser,
			hashedPassword: await hashPassword(fakeUserPassword),
		})
		if (!newFakeUser) throw new Error('Unable to create a fake user.')

		fakeUsers.add(newFakeUser)
	})

	/**
	 * Deletes newly created user from database.
	 */
	test.afterEach(async () => {
		const prisma = new PrismaClient()
		await prisma.user.deleteMany({
			where: { id: { in: [...fakeUsers].map((u) => u.id) } },
		})
		await prisma.$disconnect()
	})

	test('Should redirect to "/account" on success log in.', async ({ page }) => {
		if (!fakeUser || typeof fakeUser.email !== 'string')
			throw new Error('Unable to create a new test user.')

		await page.goto('/login/email')

		await page.getByLabel('Email').click()
		await page.getByLabel('Email').fill(fakeUser.email)
		await page.getByLabel('Email').press('Tab')
		await page.getByLabel('Password').fill(fakeUserPassword)
		await page.getByRole('button', { name: 'Continue' }).click()

		await expect(page).toHaveURL('/account')
	})
})

test.describe('Login - Register with Email', () => {
	/**
	 * Creates a fake user.
	 */
	const fakeUser = createFakeEmailUser()
	const fakeUserPassword = 'password'

	/**
	 * Uses a clean context with given storage state.
	 */
	test.use({ storageState: { cookies: [], origins: [] } })

	/**
	 * Deletes newly created user from database.
	 */
	test.afterEach(async () => {
		if (!fakeUser || typeof fakeUser.email !== 'string')
			throw new Error('Unable to delete a test user.')

		const prisma = new PrismaClient()
		await prisma.user.delete({
			where: { email: fakeUser.email },
		})
		await prisma.$disconnect()
	})

	test('Should redirect to "/account" on success registration.', async ({
		page,
	}) => {
		if (
			!fakeUser ||
			typeof fakeUser.name !== 'string' ||
			typeof fakeUser.email !== 'string'
		)
			throw new Error('Unable to create a test user.')

		await page.goto('/login/register')
		await expect(page).toHaveURL('/login/register')

		await page.getByLabel('Name').click()
		await page.getByLabel('Name').fill(fakeUser.name)
		await page.getByLabel('Name').press('Tab')
		await page.getByLabel('Email').fill(fakeUser.email)
		await page.getByLabel('Email').press('Tab')
		await page.getByTestId('password').fill(fakeUserPassword)
		await page.getByTestId('password').press('Tab')
		await page.getByTestId('confirm-password').fill(fakeUserPassword)
		await page.getByRole('button', { name: 'Continue' }).click()

		await expect(page).toHaveURL('/account')
	})
})
