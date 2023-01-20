import { test, expect } from '@playwright/test'

test.describe('App', () => {
	test('Should remain at "/".', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveURL('/')
	})
})
