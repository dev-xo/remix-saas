/**
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
import * as cookie from 'cookie'
import { z } from 'zod'
import { useFetcher } from '@remix-run/react'
import { useHints } from '#app/utils/hooks/use-hints'
import { useRequestInfo } from '#app/utils/hooks/use-request-info'

export const ThemeSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  redirectTo: z.string().optional(),
})

export const THEME_COOKIE_KEY = '_theme'
export type Theme = 'light' | 'dark'
export type ThemeExtended = Theme | 'system'

/**
 * Returns a parsed Cookie theme value, or null if Cookie is not present or invalid.
 */
export function getTheme(request: Request): Theme | null {
  const cookieHeader = request.headers.get('Cookie')
  const parsed = cookieHeader ? cookie.parse(cookieHeader)[THEME_COOKIE_KEY] : 'light'

  if (parsed === 'light' || parsed === 'dark') {
    return parsed
  }

  return null
}

/**
 * Returns a serialized Cookie string for the given theme.
 */
export function setTheme(theme: Theme | 'system') {
  if (theme === 'system') {
    return cookie.serialize(THEME_COOKIE_KEY, '', {
      path: '/',
      maxAge: -1,
      sameSite: 'lax',
    })
  } else {
    return cookie.serialize(THEME_COOKIE_KEY, theme, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
  }
}

/**
 * Returns the user's theme preference, or the Client Hint theme,
 * if the user has not set a preference.
 */
export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }
  return requestInfo.userPrefs.theme ?? hints.theme
}

/**
 * If the user's changing their theme mode preference,
 * this will return the value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const themeFetcher = useFetcher({ key: 'theme-fetcher' })

  if (themeFetcher && themeFetcher.formData) {
    const formData = Object.fromEntries(themeFetcher.formData)
    const { theme } = ThemeSchema.parse(formData)

    return theme
  }
}
