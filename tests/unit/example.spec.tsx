import '@testing-library/jest-dom'
import { describe, expect, it } from 'vitest'
/* import { render, screen } from '../utils' */
/* import ExampleComponent from '~/components/ExampleComponent' */

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

	/* it('Should have "Default message." as text content.', async () => {
		render(<ExampleComponent message="" />)
		expect(screen.getByTestId('example-element')).toHaveTextContent(
			'Default message.',
		)
	})

	it('Should have "Vitest message." as text content.', async () => {
		render(<ExampleComponent message="Vitest message." />)
		expect(screen.getByTestId('example-element')).toHaveTextContent(
			'Vitest message.',
		)
	}) */
})
