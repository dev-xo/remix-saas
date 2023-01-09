import type { UserSession } from '~/services/auth/session.server'

import { Authenticator } from 'remix-auth'
import { TwitterStrategy } from 'remix-auth-twitter'
import {
	SocialsProvider,
	GoogleStrategy,
	GitHubStrategy,
	DiscordStrategy,
} from 'remix-auth-socials'
import { FormStrategy } from 'remix-auth-form'

import { sessionStorage } from '~/services/auth/session.server'
import { getUserById, getUserByEmail } from '~/models/user/get-user'
import { createSocialUser, createEmailUser } from '~/models/user/create-user'

import { hashPassword, validateHashPassword } from './utils/encryption.server'
import { AUTH_KEYS } from '~/lib/constants'

/**
 * Inits Authenticator.
 */
export let authenticator = new Authenticator<UserSession>(sessionStorage, {
	sessionErrorKey: 'SESSION_ERROR',
	throwOnError: true,
})

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
			const user = await getUserById(profile.id, {
				subscription: true,
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser(
					{
						id: profile.id,
						name: profile.displayName,
						email: profile._json.email,
						avatar: profile._json.picture,
					},
					{ subscription: true },
				)
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
			const user = await getUserById(profile.id, {
				subscription: true,
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser(
					{
						id: profile.id,
						name: profile.displayName,
						email: profile._json.email,
						avatar: profile._json.avatar_url,
					},
					{ subscription: true },
				)
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
			const user = await getUserById(profile.id, {
				subscription: true,
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser(
					{
						id: profile.id,
						name: profile.displayName,
						email: profile.__json.email ? profile.__json.email : '',
						avatar: profile.__json.avatar
							? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
							: '',
					},
					{ subscription: true },
				)
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
			const user = await getUserById(profile.id_str, {
				subscription: true,
			})

			if (!user) {
				// Creates and stores a new user in database.
				const newUser = await createSocialUser(
					{
						id: profile.id_str,
						name: profile.name,
						email: profile.email ? profile.email : '',
						avatar: profile.profile_image_url,
					},
					{ subscription: true },
				)
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
 * Strategies - Email Form.
 */
authenticator.use(
	new FormStrategy(async ({ form, context }) => {
		// Force casting type to UserSession.
		// This is required by the `Authenticator` type in this case.
		let user = {} as UserSession

		const email = form.get('email')
		const password = form.get('password')

		if (typeof email !== 'string' || typeof password !== 'string') {
			throw new Error('Invalid email or password.')
		}

		switch (context && context.action) {
			/**
			 * Login context.
			 */
			case AUTH_KEYS.IS_LOGIN_CONTEXT: {
				// Checks for user existence in database.
				const dbUser = await getUserByEmail(email, {
					password: true,
					subscription: true,
				})
				if (!dbUser || !dbUser.password) throw new Error('User not found.')

				// Validates provided credentials with database ones.
				const isPasswordValid = await validateHashPassword(
					password,
					dbUser.password.hash,
				)
				if (!isPasswordValid) throw new Error('Incorrect credentials.')

				// Sets user to database user.
				return (user = dbUser)
			}

			/**
			 * Register context.
			 */
			case AUTH_KEYS.IS_REGISTER_CONTEXT: {
				const name = form.get('name')
				if (typeof name !== 'string') throw new Error('Invalid name.')

				// Checks if email is already in use.
				const dbUser = await getUserByEmail(email, {
					subscription: true,
				})
				if (dbUser && dbUser.email === email)
					throw new Error('Email is already in use.')

				// Hashes password.
				const hashedPassword = await hashPassword(password)

				// Creates and stores a new user in database.
				const newUser = await createEmailUser(
					{
						name,
						email,
						avatar: `https://ui-avatars.com/api/?&name=${name}&background=random`,
					},
					hashedPassword,
					{ subscription: true },
				)
				if (!newUser) throw new Error('Failed to create a new user.')

				// Sets user as newly created user.
				return (user = newUser)
			}
		}

		// Returns user as Session.
		return user
	}),
)
