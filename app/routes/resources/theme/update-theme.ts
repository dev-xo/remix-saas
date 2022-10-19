import { createThemeAction } from 'remix-themes';
import { themeSessionResolver } from '~/services/theme/session.server';

/**
 * Remix - Action.
 * @required Template code.
 */
export const action = createThemeAction(themeSessionResolver);
