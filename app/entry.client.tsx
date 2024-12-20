import { RemixBrowser } from '@remix-run/react'
import i18next from 'i18next'
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { getInitialNamespaces } from 'remix-i18next/client'
import * as i18n from '#app/modules/i18n/i18n'

async function main() {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18next
    // Initialize `react-i18next`.
    .use(initReactI18next)
    // Setup client-side language detector.
    .use(I18nextBrowserLanguageDetector)
    .init({
      ...i18n,
      ns: getInitialNamespaces(),
      detection: {
        // Enable HTML tag detection only by detecting the language server-side.
        // Using `<html lang>` attribute to communicate the detected language to the client.
        order: ['htmlTag'],
        // Since we solely utilize htmlTag, browser language caching is unnecessary.
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
