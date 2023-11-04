/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  postcss: true,
  tailwind: true,
  serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['**/.*'],

  // Future Features.
  future: {
    v2_dev: true,
    v2_meta: true,
    v2_errorBoundary: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
  },

  // Flat Routes.
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
}
