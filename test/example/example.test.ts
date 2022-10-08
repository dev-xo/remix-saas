import { describe, expect, it } from 'vitest'

describe('Smoke test.', () => {
	it('Should successfully pass.', () => {
		const hasVitestConfiguredSuccessfully = true
		expect(hasVitestConfiguredSuccessfully).toBeTruthy()
	})
})
