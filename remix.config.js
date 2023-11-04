const { flatRoutes } = require('remix-flat-routes')

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  routes: async (defineRoutes) => flatRoutes('routes', defineRoutes),
  serverDependenciesToBundle: [/^remix-utils.*/],
  serverModuleFormat: 'cjs',
}
