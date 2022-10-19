import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'

/**
 * Session.
 * @required Template code.
 */
const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__theme',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [process.env.SESSION_SECRET || 'NOT_A_STRONG_SESSION_SECRET'],
		secure: process.env.NODE_ENV === 'production',
	},
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
