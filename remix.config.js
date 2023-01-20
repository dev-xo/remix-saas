/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { flatRoutes } = require('remix-flat-routes')

module.exports = {
	cacheDirectory: './node_modules/.cache/remix',
	ignoredRouteFiles: ['**/*'],

	routes: async (defineRoutes) => {
		return flatRoutes('routes', defineRoutes)
	},
}
