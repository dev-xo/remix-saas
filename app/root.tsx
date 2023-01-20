import type { LinksFunction, MetaFunction, DataFunctionArgs } from '@remix-run/node'

import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from '@remix-run/react'

import { getGlobalEnvs } from './lib/utils/envs'
import TailwindCSS from './styles/tailwind.css'

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: TailwindCSS }]
}

export const meta: MetaFunction = () => {
	return {
		viewport: 'width=device-width, initial-scale=1',
		charset: 'utf-8',
		title: 'Stripe Stack - Remix',
		description: `A Stripe focused Remix Stack that integrates User Subscriptions, 
		Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
		keywords:
			'remix, stripe, remix-stack, typescript, sqlite, postgresql, prisma, tailwindcss, fly.io',
		'og:title': 'Stripe Stack - Remix',
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
		'twitter:title': 'Stripe Stack - Remix',
		'twitter:description': `A Stripe focused Remix Stack that integrates User Subscriptions, 
		Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
	}
}

export function loader({ request }: DataFunctionArgs) {
	return { ENV: getGlobalEnvs() }
}

export default function App() {
	const { ENV } = useLoaderData<typeof loader>()

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
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
