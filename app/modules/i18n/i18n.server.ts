import { createCookie } from '@remix-run/node'
import { RemixI18Next } from 'remix-i18next/server'

import * as i18n from '#app/modules/i18n/i18n'

export const localeCookie = createCookie('lng', {
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
})

export default new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLangs,
    fallbackLanguage: i18n.fallbackLang,
    cookie: localeCookie,
  },
  // Configuration for i18next used when
  // translating messages server-side only.
  i18next: {
    ...i18n,
  },
})
