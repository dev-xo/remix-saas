import type { MetaFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLocation } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Log In',
	}
}

/**
 * Remix - Loader.
 */
export async function loader({ request }: LoaderArgs) {
	// Checks for Auth Session.
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	})

	return json({})
}

export default function LoginRoute() {
	const location = useLocation()

	const subHeaderText = () => {
		switch (location.pathname) {
			case '/login':
				return 'Continue with your preferred authentication method'
			case '/login/email':
				return 'Log In with Email'
			case '/login/register':
				return 'Create a new account'
			case '/login/request':
				return 'Forgot your password?'
			case '/login/reset':
				return 'Reset your password'
		}
	}

	return (
		<div className="relative bottom-6 flex h-full w-full flex-col items-center justify-center px-8">
			{/* Headers. */}
			<div className="flex w-full max-w-md flex-col">
				<h5 className="text-left text-3xl font-bold text-gray-800 dark:text-gray-100">
					Remix
				</h5>
				<h5 className="text-left text-3xl font-semibold text-gray-600 dark:text-gray-400">
					{location && subHeaderText()}
				</h5>
			</div>
			<div className="mb-3" />

			{/* Outlet. */}
			<Outlet />
			<div className="mb-6" />

			{/* Example Privacy Message. */}
			<p className="max-w-md text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
				By clicking “Continue" you acknowledge that this is a simple demo, and
				you can use it in the way you like.
			</p>
		</div>
	)
}
