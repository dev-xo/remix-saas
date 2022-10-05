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
			'An Open Source Remix template that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. Deploys to Fly.io ',
		keywords:
			'remix,stripe,create-remix,remix-stack,typescript,sqlite,prisma,tailwindcss,fly.io',
		'og:title': 'Remix Stripe Stack',
		'og:type': 'website',
		'og:url': 'https://stripe-stack.fly.dev',
		'og:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/thumbnail-sqlite-v3.png',
		'og:card': 'summary_large_image',
		'og:creator': '@DanielKanem',
		'og:site': 'https://stripe-stack.fly.dev',
		'og:description':
			'An Open Source Remix template that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. Deploys to Fly.io ',
		'twitter:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/thumbnail-sqlite-v3.png',
		'twitter:card': 'summary_large_image',
		'twitter:creator': '@DanielKanem',
		'twitter:title': 'Remix Stripe Stack',
		'twitter:description':
			'An Open Source Remix template that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. Deploys to Fly.io ',
	}
}

/**
 * Remix - Loader.
 * @required Template code.
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
				<h1 className="text-center text-3xl font-semibold">
					Whops.
					<br />
					Something went wrong!
				</h1>
				<Scripts />
			</body>
		</html>
	)
}

/**
 * App.
 * @required Template code.
 */
function App() {
	const data = useLoaderData()
	const [theme] = useTheme()

	return (
		<html lang="en" className={theme ?? ''}>
			<head>
				<Meta />
				<Links />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
			</head>
			<body className="h-screen bg-white dark:bg-[#090909]">
				<Outlet />
				<ScrollRestoration />
				<Scripts />

				{/* Global Shared Envs. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(data.ENV)}`,
					}}
				/>

				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}

/**
 * Root.
 * @required Template code.
 */
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
