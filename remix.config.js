/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  cacheDirectory: './node_modules/.cache/remix',
  ignoredRouteFiles: ['**/*'],

  // Future Features.
  future: {
    // v2_meta: true,
    v2_errorBoundary: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    unstable_tailwind: true,
  },

  // Flat Routes.
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
}
