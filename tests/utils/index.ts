import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
	cleanup()
})

const customRender = (ui: React.ReactElement, options = {}) =>
	render(ui, {
		// Wrap provider(s) here if needed.
		wrapper: ({ children }) => children,
		...options,
	})

export * from '@testing-library/react'
export { customRender as render }
