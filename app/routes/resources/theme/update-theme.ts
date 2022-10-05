import { createThemeAction } from 'remix-themes'
import { themeSessionResolver } from '~/modules/theme/session.server'

/**
 * Remix - Action.
 * @required Template code.
 */
export const action = createThemeAction(themeSessionResolver)
