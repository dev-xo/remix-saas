/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Learn more about Vite: https://vitejs.dev/config/
 */
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./tests/setup-vitest.ts'],

		// Excluding `e2e tests` avoids overlapping with Playwright.
		exclude: ['./tests/e2e/*', 'node_modules'],

		// Disable CSS if you don't have tests that relies on it.
		css: false,
	},
})
