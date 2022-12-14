import type { UserSession } from '~/services/auth/session.server'

import { Authenticator } from 'remix-auth'
import { TwitterStrategy } from 'remix-auth-twitter'
import {
	SocialsProvider,
	GoogleStrategy,
	GitHubStrategy,
	DiscordStrategy,
} from 'remix-auth-socials'

import { sessionStorage } from '~/services/auth/session.server'
import { getUserById } from '~/models/user/get-user'
import { createSocialUser } from '~/models/user/create-user'

/**
 * Inits Authenticator.
 */
export let authenticator = new Authenticator<UserSession>(sessionStorage)

const HOST_URL =
	process.env.NODE_ENV === 'development'
		? process.env.DEV_HOST_URL
		: process.env.PROD_HOST_URL

/**
 * Strategies - Google.
 */
authenticator.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
			callbackURL: `${HOST_URL}/auth/${SocialsProvider.GOOGLE}/callback`,
			prompt: 'consent',
		},
		async ({ profile }) => {
			// Checks for user existence in database.
			const user = await getUserById({
				id: profile.id,
				include: {
					subscription: true,
				},
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser({
					user: {
						id: profile.id,
						name: profile.displayName,
						email: profile._json.email,
						avatar: profile._json.picture,
					},
					include: {
						subscription: true,
					},
				})
				if (!newUser) throw new Error('Failed to create a new user.')

				// Returns newly created user as Session.
				return newUser
			}

			// Returns user from database as Session.
			return user
		},
	),
)

/**
 * Strategies - GitHub.
 */
authenticator.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
			callbackURL: `${HOST_URL}/auth/${SocialsProvider.GITHUB}/callback`,
		},
		async ({ profile }) => {
			// Checks for user existence in database.
			const user = await getUserById({
				id: profile.id,
				include: {
					subscription: true,
				},
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser({
					user: {
						id: profile.id,
						name: profile.displayName,
						email: profile._json.email,
						avatar: profile._json.avatar_url,
					},
					include: {
						subscription: true,
					},
				})
				if (!newUser) throw new Error('Failed to create a new user.')

				// Returns newly created user as Session.
				return newUser
			}

			// Returns user from database as Session.
			return user
		},
	),
)

/**
 * Strategies - Discord.
 */
authenticator.use(
	new DiscordStrategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID || '',
			clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
			callbackURL: `${HOST_URL}/auth/${SocialsProvider.DISCORD}/callback`,
			scope: ['identify', 'email'],
		},
		async ({ profile }) => {
			// Checks for user existence in database.
			const user = await getUserById({
				id: profile.id,
				include: {
					subscription: true,
				},
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser({
					user: {
						id: profile.id,
						name: profile.displayName,
						email: profile.__json.email ? profile.__json.email : '',
						avatar: profile.__json.avatar
							? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
							: '',
					},
					include: {
						subscription: true,
					},
				})
				if (!newUser) throw new Error('Failed to create a new user.')

				// Returns newly created user as Session.
				return newUser
			}

			// Returns user from database as Session.
			return user
		},
	),
)

/**
 * Strategies - Twitter.
 */
authenticator.use(
	new TwitterStrategy(
		{
			clientID: process.env.TWITTER_CLIENT_ID || '',
			clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
			callbackURL: `${HOST_URL}/auth/twitter/callback`,
			includeEmail: true,
		},
		async ({ accessToken, accessTokenSecret, profile }) => {
			// Checks for user existence in database.
			const user = await getUserById({
				id: profile.id_str,
				include: {
					subscription: true,
				},
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser({
					user: {
						id: profile.id_str,
						name: profile.name,
						email: profile.email ? profile.email : '',
						avatar: profile.profile_image_url,
					},
					include: {
						subscription: true,
					},
				})
				if (!newUser) throw new Error('Failed to create a new user.')

				// Returns newly created user as Session.
				return newUser
			}

			// Returns user from database as Session.
			return user
		},
	),
)
