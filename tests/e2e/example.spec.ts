import { test, expect } from '@playwright/test';

/**
 * Learn more about Playwright:
 * https://github.com/microsoft/playwright
 */
test('Homepage should have a page title.', async ({ page }) => {
	await page.goto('/');

	// Expect page to have 'x' title.
	await expect(page).toHaveTitle(/Welcome to Stripe Stack!/);
});
