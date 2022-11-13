import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '~/services/theme/session.server'

/**
 * Remix - Action.
 */
export const action = createThemeAction(themeSessionResolver)
