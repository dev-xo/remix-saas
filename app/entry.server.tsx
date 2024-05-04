import type { AppLoadContext, EntryContext } from '@remix-run/node'
import isbot from 'isbot'
import { PassThrough } from 'node:stream'
import { RemixServer } from '@remix-run/react'
import { createReadableStreamFromReadable } from '@remix-run/node'
import { renderToPipeableStream } from 'react-dom/server'
import { createInstance } from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { initEnvs } from '#app/utils/env.server'
import { NonceProvider } from '#app/utils/hooks/use-nonce'
import i18nServer from '#app/modules/i18n/i18n.server'
import * as i18n from '#app/modules/i18n/i18n'

/**
 * Environment Variables.
 */
initEnvs()

const ABORT_DELAY = 5_000

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady'

  /**
   * Content Security Policy.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
   */
  const nonce = String(loadContext.cspNonce) ?? undefined

  /**
   * Currently, we're not setting the CSP headers due to lack of support on deferred scripts.
   * @see https://github.com/remix-run/remix/issues/5156
   *
  responseHeaders.set(
    'Content-Security-Policy',
    `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none';`,
  )
  */

  /**
   * Internationalization (i18n).
   */
  const instance = createInstance()
  const lng = await i18nServer.getLocale(request)
  const ns = i18nServer.getRouteNamespaces(remixContext)

  await instance.use(initReactI18next).init({
    ...i18n,
    lng,
    ns,
  })

  return new Promise((resolve, reject) => {
    let shellRendered = false

    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <I18nextProvider i18n={instance}>
          <RemixServer
            context={remixContext}
            url={request.url}
            abortDelay={ABORT_DELAY}
          />
        </I18nextProvider>
      </NonceProvider>,
      {
        [callbackName]: () => {
          shellRendered = true
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)

          responseHeaders.set('Content-Type', 'text/html')

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )

          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          responseStatusCode = 500
          // Log streaming rendering errors from inside the shell.
          // Don't log errors encountered during initial shell rendering,
          // since they'll reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error)
          }
        },
        nonce,
      },
    )

    setTimeout(abort, ABORT_DELAY)
  })
}
