import { test, expect } from '@playwright/test'

test.describe('App Root - Unauthenticated', () => {
	test.use({ storageState: { cookies: [], origins: [] } })

	test('Should remain at "/".', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL('/')
	})
})

test.describe('App Root - Authenticated', () => {
	test('Should redirect to "/account".', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL('/account')
	})
})
