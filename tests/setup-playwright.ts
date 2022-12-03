import type { FullConfig } from '@playwright/test'
import { request } from '@playwright/test'

/**
 * Playwright Setup.
 *
 * Important: Playwright requires a testing user to be already stored into database.
 * This is usually automatically created when you initialize the template.
 * In case there isn't one, run: `npx prisma migrate reset --force` into your console.
 */
async function globalSetup(config: FullConfig) {
	// Creates a new context, and does a POST request to '/login/email' route.
	const requestContext = await request.newContext()
	await requestContext.post('http://localhost:8811/login/email', {
		form: {
			email: 'playwright@test.com',
			password: 'password',
		},
	})

	// Saves signed-in state to './tests/auth-storage.json'.
	await requestContext.storageState({ path: './tests/auth-storage.json' })
	await requestContext.dispose()
}

export default globalSetup
