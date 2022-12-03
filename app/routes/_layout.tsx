import type { LoaderArgs } from '@remix-run/node'
import type { AuthSession } from '~/lib/auth/session.server'

import { redirect, json } from '@remix-run/node'
import { useLoaderData, Outlet } from '@remix-run/react'
import { authenticator } from '~/lib/auth/config.server'

import { Navigation } from '~/components/navigation'
import { Footer } from '~/components/footer'

interface LoaderData {
	user: AuthSession | null
}

export async function loader({ request }: LoaderArgs) {
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
		<div className="flex h-screen flex-col">
			{/* Navigation. */}
			<Navigation user={user} />

			{/* Outlet. */}
			<Outlet />

			{/* Footer. */}
			<Footer />
		</div>
	)
}
