import { RemixBrowser } from '@remix-run/react'
import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'
import * as i18n from '#app/modules/i18n/i18n'

async function main() {
  await i18next
    .use(initReactI18next) // Tell i18next to use the react-i18next plugin
    .use(I18nextBrowserLanguageDetector) // Setup a client-side language detector
    .init({
      ...i18n,
      ns: getInitialNamespaces(),
      detection: {
        // Here only enable htmlTag detection, we'll detect the language only
        // server-side with remix-i18next, by using the `<html lang>` attribute
        // we can communicate to the client the language detected server-side
        order: ['htmlTag'],
        // Because we only use htmlTag, there's no reason to cache the language
        // on the browser, so we disable it
        caches: [],
      },
    })

  startTransition(() => {
    hydrateRoot(
      document,
      <I18nextProvider i18n={i18next}>
        <RemixBrowser />
      </I18nextProvider>,
    )
  })
}

main().catch((error) => console.error(error))
