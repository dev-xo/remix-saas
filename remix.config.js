const { flatRoutes } = require('remix-flat-routes')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: [/^remix-utils.*/],
  serverModuleFormat: 'cjs',

  // Future Features.
  future: {
    v2_dev: true,
    v2_meta: false,
    v2_meta: true,
    v2_errorBoundary: true,
    v2_routeConvention: true,
    v2_normalizeFormMethod: true,
  },
  
  routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
}
