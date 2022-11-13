import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'

/**
 * Example tests.
 * Learn more about MSW: https://mswjs.io
 * Learn more about Vitest: https://vitest.dev
 * Learn more about Testing Library: https://testing-library.com/
 */
describe('Example unit tests.', () => {
	it('Should get data from Mocks.', async () => {
		const data = await fetch('https://my-mock-api.com').then((response) =>
			response.json(),
		)
		expect(data).not.toBeNull()
	})
})
