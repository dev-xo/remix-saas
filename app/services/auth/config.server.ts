import type { AuthSession } from '~/services/auth/session.server'
import { Authenticator } from 'remix-auth'
import {
	SocialsProvider,
	GoogleStrategy,
	GitHubStrategy,
	DiscordStrategy,
} from 'remix-auth-socials'
import { TwitterStrategy } from 'remix-auth-twitter'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from '~/services/auth/session.server'
import {
	getUserByIdIncludingSubscription,
	getUserByEmailIncludingSubscriptionAndPassword,
} from '~/models/user.server'
import { createSocialUser, createEmailUser } from '~/models/user.server'
import bcrypt from 'bcryptjs'

/**
 * Init.
 * @required Template code.
 */
export let authenticator = new Authenticator<AuthSession>(sessionStorage, {
	sessionErrorKey: 'AUTH_SESSION_ERROR_KEY',
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
			// Checks for User existence in database.
			const user = await getUserByIdIncludingSubscription(profile.id)

			// If User has not been found:
			// - Creates and stores a new User in database.
			// - Returns newly created User as Auth Session.
			if (!user) {
				const newUser = await createSocialUser({
					id: profile.id,
					name: profile.displayName,
					email: profile._json.email,
					avatar: profile._json.picture,
				})
				if (!newUser)
					throw new Error('There was an Error trying to create a new User.')

				return newUser
			}

			// Returns user from database as Auth Session.
			return user
		},
	),
)

/**
 * Strategies - Github.
 */
authenticator.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID || '',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
			callbackURL: `${HOST_URL}/auth/${SocialsProvider.GITHUB}/callback`,
		},
		async ({ profile }) => {
			// Checks for User existence in database.
			const user = await getUserByIdIncludingSubscription(profile.id)

			// If User has not been found:
			// - Creates and stores a new User in database.
			// - Returns newly created User as Auth Session.
			if (!user) {
				const newUser = await createSocialUser({
					id: profile.id,
					name: profile.displayName,
					email: profile._json.email,
					avatar: profile._json.avatar_url,
				})
				if (!newUser)
					throw new Error('There was an Error trying to create a new User.')

				return newUser
			}

			// Returns user from database as Auth Session.
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
			// Checks for User existence in database.
			const user = await getUserByIdIncludingSubscription(profile.id)

			// If User has not been found:
			// - Creates and stores a new User in database.
			// - Returns newly created User as Auth Session.
			if (!user) {
				const newUser = await createSocialUser({
					id: profile.id,
					name: profile.displayName,
					email: profile.__json.email ? profile.__json.email : '',
					avatar: profile.__json.avatar
						? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
						: '',
				})
				if (!newUser)
					throw new Error('There was an Error trying to create a new User.')

				return newUser
			}

			// Returns user from database as Auth Session.
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
			// Checks for User existence in database.
			const user = await getUserByIdIncludingSubscription(profile.id_str)

			// If User has not been found:
			// - Creates and stores a new User in database.
			// - Returns newly created User as Auth Session.
			if (!user) {
				const newUser = await createSocialUser({
					id: profile.id_str,
					name: profile.name,
					email: profile.email ? profile.email : '',
					avatar: profile.profile_image_url,
				})
				if (!newUser)
					throw new Error('There was an Error trying to create a new User.')

				return newUser
			}

			// Returns user from database as Auth Session.
			return user
		},
	),
)

/**
 * Strategies - FormStrategy.
 */
authenticator.use(
	new FormStrategy(async ({ form, context }) => {
		// Gets values from `formData`.
		// We'll use `formType` to determine if user is trying to signup or login.
		const { name, email, password, formType } = Object.fromEntries(form)

		// Validates `formData` values.
		// This could be extended with libraries like: https://zod.dev
		if (typeof email !== 'string' || !email.includes('@'))
			throw new Error('Email does not match our required criteria.')

		// Checks for User existence in database.
		const dbUser = await getUserByEmailIncludingSubscriptionAndPassword(email)

		if (formType === 'login') {
			// Validates database User and provided `formData` fields.
			if (!dbUser || !dbUser.password) throw new Error('Whops! User not found.')
			if (!password || typeof password !== 'string')
				throw new Error('Password is required.')

			// Compares database `user.password` with provided `formData` password.
			const isValid = await bcrypt.compare(password, dbUser.password.hash)
			if (!isValid)
				throw new Error(
					'User or Password does not match our required criteria.',
				)

			// Returns database User as Auth Session.
			return dbUser
		}

		if (formType === 'signup') {
			// Validates database user and provided `formData` fields.
			if (dbUser && dbUser?.email === email)
				throw new Error('Whops! Email is already in use.')
			if (password && typeof password !== 'string')
				throw new Error('Password is required.')
			if (name && typeof name !== 'string') throw new Error('Name is required.')

			// Hashes provided `formData` password.
			const hashedPassword = await bcrypt.hash(password, 10)

			// Creates and stores a new User in database.
			const newUser = await createEmailUser(
				{
					name,
					email,
					avatar: `https://ui-avatars.com/api/?name=${name}`,
				},
				hashedPassword,
			)
			if (!newUser)
				throw new Error('There was an Error trying to create a new User.')

			// Returns newly created User as Auth Session.
			return newUser
		}

		// Whops!
		throw new Error('Whops! Something went wrong!')
	}),

	// Strategy name.
	'email',
)
