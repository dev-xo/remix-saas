import type {
	LinksFunction,
	LoaderFunction,
	MetaFunction,
	ErrorBoundaryComponent,
} from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'
import { ThemeProvider, PreventFlashOnWrongTheme, useTheme } from 'remix-themes'
import { themeSessionResolver } from '~/modules/theme/session.server'
import { getGlobalEnvs } from './utils'

import tailwindStylesheetUrl from './styles/tailwind.css'

/**
 * Remix - Links.
 */
export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }]
}

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		viewport: 'width=device-width, initial-scale=1',
		charset: 'utf-8',
		title: 'Welcome to Remix Stripe Stack!',
		description:
			'An open source Remix Stack that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. SQLite version. Deploys to Fly.io',
		keywords:
			'remix,stripe,create-remix,remix-stack,typescript,sqlite,prisma,tailwindcss,fly.io',
		'og:title': 'Remix Stripe Stack',
		'og:type': 'website',
		'og:url': 'https://stripe-stack.fly.dev',
		'og:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/light-thumbnail.png',
		'og:card': 'summary_large_image',
		'og:creator': '@DEV_XO2',
		'og:site': 'https://stripe-stack.fly.dev',
		'og:description':
			'An open source Remix Stack that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. SQLite version. Deploys to Fly.io',
		'twitter:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/light-thumbnail.png',
		'twitter:card': 'summary_large_image',
		'twitter:creator': '@DEV_XO2',
		'twitter:title': 'Remix Stripe Stack',
		'twitter:description':
			'An open source Remix Stack that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. SQLite version. Deploys to Fly.io',
	}
}

/**
 * Remix - Loader.
 * @protected Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	const { getTheme } = await themeSessionResolver(request)
	return { theme: getTheme(), ENV: getGlobalEnvs() }
}

/**
 * Remix - Error Boundary.
 */
export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	console.error(error)
	return (
		<html>
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body className="flex h-screen flex-col items-center justify-center">
				{/* Add here the UI you want your users to see. */}
				<h1 className="text-2xl">Something went wrong!</h1>
				<Scripts />
			</body>
		</html>
	)
}

/**
 * Root.
 * @protected Template code.
 */
const App = () => {
	const data = useLoaderData()
	const [theme] = useTheme()

	return (
		<html lang="en" className={theme ?? ''}>
			<head>
				{/* All meta exports on all routes. */}
				<Meta />

				{/* All link exports on all routes. */}
				<Links />

				{/* Prevents theme flashing. */}
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
			</head>
			<body className="h-screen bg-white dark:bg-[#090909]">
				{/* Child routes. */}
				<Outlet />

				{/* Manages scroll position for client-side transitions. */}
				<ScrollRestoration />

				{/* Global Shared Envs. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>

				{/* Script tags. */}
				<Scripts />

				{/* Sets up automatic reload during development. */}
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}

export default function AppWithProviders() {
	const data = useLoaderData()

	return (
		<ThemeProvider
			specifiedTheme={data.theme}
			themeAction="/resources/theme/update-theme">
			<App />
		</ThemeProvider>
	)
}
