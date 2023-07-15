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
    v2_meta: false,
    v2_errorBoundary: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
    unstable_dev: true,
  },

  // Flat Routes.
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
}
