import { createRequestHandler } from '@remix-run/express'
import { installGlobals } from '@remix-run/node'
import crypto from 'crypto'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

installGlobals()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV ?? 'development'

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      )

const app = express()

/**
 * Good practices: Disable x-powered-by.
 * @see http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
 */
app.disable('x-powered-by')

app.use(compression())
app.use(morgan('tiny'))

/**
 * Content Security Policy.
 * Implementation based on github.com/epicweb-dev/epic-stack
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
app.use((_, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
  next()
})

app.use(
  helmet({
    contentSecurityPolicy: {
      referrerPolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: false,
      // ❗Important: Remove `reportOnly` to enforce CSP. (Development only).
      reportOnly: true,
      directives: {
        // Controls allowed endpoints for fetch, XHR, WebSockets, etc.
        'connect-src': [NODE_ENV === 'development' ? 'ws:' : null, "'self'"].filter(
          Boolean,
        ),
        // Defines which origins can serve fonts to your site.
        'font-src': ["'self'"],
        // Specifies origins allowed to be embedded as frames.
        'frame-src': ["'self'"],
        // Determines allowed sources for images.
        'img-src': ["'self'", 'data:'],
        // Sets restrictions on sources for <script> elements.
        'script-src': [
          "'strict-dynamic'",
          "'self'",
          (_, res) => `'nonce-${res.locals.cspNonce}'`,
        ],
        // Controls allowed sources for inline JavaScript event handlers.
        'script-src-attr': [(_, res) => `'nonce-${res.locals.cspNonce}'`],
        // Enforces that requests are made over HTTPS.
        'upgrade-insecure-requests': null,
      },
    },
  }),
)

/**
 * Clean route paths. (No ending slashes, Better SEO)
 */
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    const safePath = req.path.slice(0, -1).replace(/\/+/g, '/')
    res.redirect(301, safePath + query)
  } else {
    next()
  }
})

/**
 * Rate Limit.
 * Implementation based on github.com/epicweb-dev/epic-stack
 *
 * NOTE: Running in development or tests, we want to disable rate limiting.
 */
const MAX_LIMIT_MULTIPLE = NODE_ENV !== 'production' ? 10_000 : 1

const defaultRateLimit = {
  windowMs: 60 * 1000,
  max: 1000 * MAX_LIMIT_MULTIPLE,
  standardHeaders: true,
  legacyHeaders: false,
}
const strongestRateLimit = rateLimit({
  ...defaultRateLimit,
  windowMs: 60 * 1000,
  max: 10 * MAX_LIMIT_MULTIPLE,
})
const strongRateLimit = rateLimit({
  ...defaultRateLimit,
  windowMs: 60 * 1000,
  max: 100 * MAX_LIMIT_MULTIPLE,
})
const generalRateLimit = rateLimit(defaultRateLimit)

app.use((req, res, next) => {
  const STRONG_PATHS = ['/auth/login']

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (STRONG_PATHS.some((path) => req.path.includes(path))) {
      return strongestRateLimit(req, res, next)
    }
    return strongRateLimit(req, res, next)
  }

  return generalRateLimit(req, res, next)
})

// Handle assets requests.
if (viteDevServer) {
  app.use(viteDevServer.middlewares)
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
  )
}
// Everything else (like favicon.ico) is cached for an hour.
// You may want to be more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }))

app.get(['/img/*', '/favicons/*'], (req, res) => {
  // If we've gone beyond express.static for these, it means something is missing.
  // In this case, we'll simply send a 404 and skip calling other middleware.
  return res.status(404).send('Not found')
})

// Handle SSR requests.
app.all(
  '*',
  createRequestHandler({
    getLoadContext: (_, res) => ({
      cspNonce: res.locals.cspNonce,
    }),

    build: viteDevServer
      ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
      : await import('./build/server/index.js'),
  }),
)

app.listen(PORT, () =>
  console.log(`Express server listening at http://localhost:${PORT}`),
)
