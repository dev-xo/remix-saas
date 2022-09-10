import { createCookieSessionStorage } from '@remix-run/node'
import { createThemeSessionResolver } from 'remix-themes'

/**
 * Session.
 * @protected Template code.
 */
const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__theme',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [
			process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'SECRET',
		],
		secure: process.env.NODE_ENV === 'production',
	},
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
