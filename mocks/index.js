/**
 * Learn more about MSW: https://mswjs.io
 */
const { setupServer } = require('msw/node')
const { handlers } = require('./handlers')

// Configures a request mocking server with the given request handlers.
const server = setupServer(...handlers)

server.listen({ onUnhandledRequest: 'bypass' })
console.info('🔶 Mock server running.')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())

module.exports = {
	server,
}
