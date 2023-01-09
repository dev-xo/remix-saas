import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { redirect, json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

import { Navigation } from '~/components/navigation'
import { Footer } from '~/components/footer'

interface LoaderData {
	user: UserSession | null
}

export async function loader({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request)

	// On Session, redirects to `/account`.
	const url = new URL(request.url)
	if (user && url.pathname === '/') return redirect('/account')

	return json<LoaderData>({ user })
}

export default function Layout() {
	// Check bellow info about why we are force casting <LoaderData>
	// https://github.com/remix-run/remix/issues/3931
	const { user } = useLoaderData() as LoaderData

	return (
		<div className="mx-auto flex h-screen max-w-7xl flex-col items-center px-6">
			{/* Background Bloobs. */}
			<div className="bloobs" />

			{/* Navigation. */}
			<Navigation user={user} />

			{/* Outlet. */}
			<Outlet />

			{/* Footer. */}
			<Footer />
		</div>
	)
}
