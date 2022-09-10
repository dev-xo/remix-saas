import { Authenticator } from 'remix-auth'
import {
	GoogleStrategy,
	GitHubStrategy,
	SocialsProvider,
	DiscordStrategy,
} from 'remix-auth-socials'
import { TwitterStrategy } from 'remix-auth-twitter'
import { sessionStorage } from '../session.server'
import { getUserByProviderIdIncludingSubscription } from '~/modules/user/queries'
import { createUser } from '~/modules/user/mutations'

/**
 * Authenticator.
 * @protected Template code.
 */
export let authenticator = new Authenticator(sessionStorage)

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
			/**
			 * Checks for User existence in database.
			 */
			const user = await getUserByProviderIdIncludingSubscription(profile.id)

			if (!user) {
				/**
				 * If User has not been found:
				 * Creates and stores a new User into database.
				 * Returns newly created User as Auth Session.
				 */
				const newUser = await createUser({
					providerId: profile.id,
					name: profile.displayName,
					email: profile._json.email,
					avatar: profile._json.picture,
				})
				if (!newUser) throw new Error('Unable to create user.')

				return {
					...newUser,
					subscription: [],
				}
			}

			/**
			 * Returns Auth Session from database.
			 */
			return { ...user }
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
			/**
			 * Checks for User existence in database.
			 */
			const user = await getUserByProviderIdIncludingSubscription(profile.id)

			if (!user) {
				/**
				 * If User has not been found:
				 * Creates and stores a new User into database.
				 * Returns newly created User as Auth Session.
				 */
				const newUser = await createUser({
					providerId: profile.id,
					name: profile.displayName,
					email: profile._json.email,
					avatar: profile._json.avatar_url,
				})
				if (!newUser) throw new Error('Unable to create user.')

				return {
					...newUser,
					subscription: [],
				}
			}

			/**
			 * Returns Auth Session from database.
			 */
			return { ...user }
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
			/**
			 * Checks for User existence in database.
			 */
			const user = await getUserByProviderIdIncludingSubscription(profile.id)

			if (!user) {
				/**
				 * If User has not been found:
				 * Creates and stores a new User into database.
				 * Returns newly created User as Auth Session.
				 */
				const newUser = await createUser({
					providerId: profile.id,
					name: profile.displayName,
					email: profile.__json.email ? profile.__json.email : '',
					avatar: profile.__json.avatar
						? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.png`
						: '',
				})
				if (!newUser) throw new Error('Unable to create user.')

				return {
					...newUser,
					subscription: [],
				}
			}

			/**
			 * Returns Auth Session from database.
			 */
			return { ...user }
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
			/**
			 * Checks for User existence in database.
			 */
			const user = await getUserByProviderIdIncludingSubscription(
				profile.id_str,
			)

			if (!user) {
				/**
				 * If User has not been found:
				 * Creates and stores a new User into database.
				 * Returns newly created User as Auth Session.
				 */
				const newUser = await createUser({
					providerId: profile.id_str,
					name: profile.name,
					email: profile.email ? profile.email : '',
					avatar: profile.profile_image_url,
				})
				if (!newUser) throw new Error('Unable to create user.')

				return {
					...newUser,
					subscription: [],
				}
			}

			/**
			 * Returns Auth Session from database.
			 */
			return { ...user }
		},
	),
)
