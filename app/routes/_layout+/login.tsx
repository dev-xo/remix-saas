import type { DataFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLocation } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

export async function loader({ request }: DataFunctionArgs) {
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	})

	return json({})
}

export default function Login() {
	const location = useLocation()

	const subHeaderText = () => {
		switch (location.pathname) {
			case '/login':
				return 'Get into your account'
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
		<div className="m-auto flex h-full max-w-md flex-col items-center justify-center px-6">
			{/* Headers. */}
			<div className="flex w-full flex-col items-center">
				{location && location.pathname === '/login' && (
					<h5 className="text-center text-3xl font-bold text-gray-200">
						Welcome back
					</h5>
				)}
				<h5 className="text-center text-2xl font-semibold text-gray-400">
					{location && subHeaderText()}
				</h5>
			</div>
			<div className="mb-6" />

			{/* Outlet. */}
			<Outlet />
			<div className="mb-6" />

			{/* Example Privacy Message. */}
			<p className="text-center text-sm font-semibold text-gray-400">
				By clicking “Continue" you acknowledge that this is a simple demo, and can be
				used in the way you like.
			</p>
		</div>
	)
}
