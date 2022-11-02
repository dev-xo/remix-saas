import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'

/* if (!process.env.SESSION_SECRET)
	throw new Error('Environment variable: SESSION_SECRET its required.') */

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
