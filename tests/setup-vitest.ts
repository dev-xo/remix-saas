import '@testing-library/jest-dom/extend-expect'
import { installGlobals } from '@remix-run/node'
import { server } from '../mocks'

/**
 * Since Remix relies on browser API's such as fetch,
 * that are not natively available in Node.js,
 * you may find that your unit tests fail without these globals,
 * when running with tools such as Jest.
 *
 * Learn more about Remix Polyfills https://remix.run/docs/en/v1/other-api/node#polyfills
 */
installGlobals()

/**
 * Inits Mocked Server.
 */
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
