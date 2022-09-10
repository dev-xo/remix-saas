import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '~/modules/theme/session.server'

/**
 * Remix - Action.
 * @protected Template code.
 */
export const action = createThemeAction(themeSessionResolver)
