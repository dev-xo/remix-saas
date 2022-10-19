import type { MetaFunction } from '@remix-run/node'
import { Outlet, useLocation } from '@remix-run/react'

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Sign up',
	}
}

export default function SignupRoute() {
	const location = useLocation()

	return (
		<div className="flex h-full w-full flex-col items-center justify-center px-6">
			{/* Headers. */}
			<div className="flex w-full max-w-md flex-col">
				<h5 className="text-left text-3xl font-bold text-gray-800 dark:text-gray-100">
					Remix
				</h5>
				<div className="mb-1" />
				<h5 className="text-left text-3xl font-semibold text-gray-600 dark:text-gray-400">
					{location && location?.pathname === '/signup/email'
						? 'Sign up with Email'
						: 'Sign up'}
				</h5>
			</div>
			<div className="mb-3" />

			{/* Outlet. */}
			<Outlet />
		</div>
	)
}
