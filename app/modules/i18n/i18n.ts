import en from '#app/modules/i18n/locales/en'
import es from '#app/modules/i18n/locales/es'

const languages = ['es', 'en'] as const

// List of languages your application supports.
export const supportedLangs = [...languages]

// Fallback language will be used if the user language is not in the supportedLangs.
export const fallbackLang = 'en'

// Default namespace of i18next is "translation", but you can customize it here.
export const defaultNS = 'translation'

// Translation files we created, with 'translation' as the default namespace.
// We'll use these to include the translations in the bundle, instead of loading them on-demand.
export type Languages = (typeof supportedLangs)[number]

export type Resource = {
  translation: typeof en
}

export const resources: Record<Languages, Resource> = {
  en: { translation: en },
  es: { translation: es },
}
