import type {
	LinksFunction,
	LoaderArgs,
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
import { themeSessionResolver } from '~/services/theme/session.server'
import { getGlobalEnvs } from '~/utils/env.server'

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
		title: 'Remix - Stripe Stack',
		description: `A Stripe focused Remix Stack that integrates User Subscriptions, 
		Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
		keywords:
			'remix, stripe, create-remix, remix-stack, typescript, sqlite, postgresql, prisma, tailwindcss, fly.io',
		'og:title': 'Remix - Stripe Stack',
		'og:type': 'website',
		'og:url': 'https://stripe-stack.fly.dev',
		'og:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
		'og:card': 'summary_large_image',
		'og:creator': '@DanielKanem',
		'og:site': 'https://stripe-stack.fly.dev',
		'og:description': `A Stripe focused Remix Stack that integrates User Subscriptions, 
		Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
		'twitter:image':
			'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
		'twitter:card': 'summary_large_image',
		'twitter:creator': '@DanielKanem',
		'twitter:title': 'Remix - Stripe Stack',
		'twitter:description': `A Stripe focused Remix Stack that integrates User Subscriptions, 
		Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
	}
}

/**
 * Remix - Loader.
 */
export async function loader({ request }: LoaderArgs) {
	const { getTheme } = await themeSessionResolver(request)
	return { ssrTheme: getTheme(), ENV: getGlobalEnvs() }
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
					Whops. Something went wrong!
				</h1>
				<div className="mb-3" />
				<p>Please, check your client console.</p>
				<Scripts />
			</body>
		</html>
	)
}

/**
 * App.
 */
function App() {
	const { ssrTheme, ENV } = useLoaderData<typeof loader>()
	const [theme] = useTheme()

	return (
		<html lang="en" className={theme ?? ''}>
			<head>
				<Meta />
				<Links />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(ssrTheme)} />
			</head>
			<body className="h-full bg-white dark:bg-[#090909]">
				<Outlet />
				<ScrollRestoration />
				<Scripts />

				{/* Global Shared Envs. */}
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(ENV)}`,
					}}
				/>

				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	)
}

/**
 * App Root.
 */
export default function AppWithProviders() {
	const { ssrTheme } = useLoaderData<typeof loader>()

	return (
		<ThemeProvider specifiedTheme={ssrTheme} themeAction="/theme/update-theme">
			<App />
		</ThemeProvider>
	)
}
