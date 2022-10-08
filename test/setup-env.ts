import { installGlobals } from '@remix-run/node'
import '@testing-library/jest-dom/extend-expect'

/**
 * Since Remix relies on browser API's such as fetch,
 * that are not natively available in Node.js,
 * you may find that your unit tests fail without these globals,
 * when running with tools such as Jest.
 *
 * Learn more about Remix Polyfills https://remix.run/docs/en/v1/other-api/node#polyfills
 */
installGlobals()
