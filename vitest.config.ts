/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    // Allows the use of `test` globals in your test files.
    globals: true,
    // Disables multi-threading and runs test serially. (Prisma will benefit from this).
    pool: 'forks',
    // Path to setup file that runs before your tests.
    setupFiles: ['./tests/setup-test-env.ts'],
    // Path to your test files.
    include: ['./tests/integration/*.test.ts'],
  },
})
