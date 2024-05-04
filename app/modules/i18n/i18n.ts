import en from '#app/modules/i18n/locales/en'
import es from '#app/modules/i18n/locales/es'

// List of languages your application supports.
export const supportedLngs = ['es', 'en']

// Fallback language will be used if the user language is not in the supportedLngs.
export const fallbackLng = 'en'

// Default namespace of i18next is "translation", but you can customize it here.
export const defaultNS = 'translation'

export const resources = {
  en: { translation: en },
  es: { translation: es },
}
