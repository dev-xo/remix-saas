import { installGlobals } from '@remix-run/node'

// Info about Single Fetch and `installGlobals`:
// https://remix.run/docs/en/main/guides/single-fetch#enabling-single-f
installGlobals({ nativeFetch: true })

// Handle `beforeEach` | `afterEach` and other setup/teardown logic here.
// afterEach(() => resetHandlers())
// afterEach(() => cleanup())
