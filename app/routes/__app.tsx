import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { redirect, json } from '@remix-run/node'
import { Outlet, useLoaderData, useLocation } from '@remix-run/react'
import { authenticator } from '~/modules/auth'
import { useTheme } from 'remix-themes'
import { Navigation, Footer } from '~/components'

type LoaderData = {
	user: Awaited<AuthSession> | null
}

/**
 * Remix - Loader.
 * @protected Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = (await authenticator.isAuthenticated(
		request,
	)) as LoaderData['user']

	/**
	 * On Auth Session: Redirects to `/account`.
	 */
	const url = new URL(request.url)
	if (user && url.pathname === '/') return redirect('/account')

	return json<LoaderData>({ user })
}

export default function AppRoute() {
	const { user } = useLoaderData() as LoaderData
	const [theme] = useTheme()
	const location = useLocation()

	const setRadialGradientBasedOnTheme =
		theme === 'light'
			? location && location.pathname === '/'
				? 'radial-gradient gradient-light'
				: 'radial-gradient gradient-light-dimmed'
			: location && location.pathname === '/'
			? 'radial-gradient gradient-dark'
			: 'radial-gradient gradient-dark-dimmed'

	return (
		<div className="flex h-screen flex-col">
			{/* Background Gradient. */}
			<div className={setRadialGradientBasedOnTheme}></div>

			<Navigation user={user} />
			<Outlet />
			<Footer />
		</div>
	)
}
