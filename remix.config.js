/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*'],

  // Future Features.
  future: {
    unstable_tailwind: true,
    v2_routeConvention: true,
  },

  // Flat Routes.
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
}
