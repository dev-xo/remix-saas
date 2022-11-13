import type { User, Subscription } from '@prisma/client'
import { createCookieSessionStorage } from '@remix-run/node'

export interface AuthSession extends User {
	subscription?: Subscription
}

/**
 * Session.
 */
export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__auth',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [process.env.SESSION_SECRET || 'SESSION_SECRET'],
		secure: process.env.NODE_ENV === 'production',
	},
})

export const { getSession, commitSession, destroySession } = sessionStorage
