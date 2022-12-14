import type { UserSession } from '~/services/auth/session.server'
import { Link, Form } from '@remix-run/react'
import { useLocation } from '@remix-run/react'

interface NavigationProps {
	user: UserSession | null
}

export function Navigation({ user }: NavigationProps) {
	const location = useLocation()

	return (
		<nav
			className="z-10 m-auto my-0 flex max-h-[80px] min-h-[80px] 
			w-full max-w-7xl flex-row items-center justify-between px-6">
			{/* Logo Link. */}
			<Link
				to={!user ? '/' : '/account'}
				prefetch="intent"
				className="flex flex-row items-center text-2xl font-light text-gray-400 transition hover:text-gray-100 active:opacity-80">
				<span className="font-bold text-gray-200">Stripe</span>&nbsp;Stack
				<div className="mx-1" />
				<small className="text-sm font-bold text-violet-200">v2.1</small>
			</Link>

			{/* Main Menu. */}
			<div
				className="fixed left-1/2 z-20 hidden min-h-[40px] -translate-x-1/2 transform 
				flex-row items-center rounded-full px-6 drop-shadow-xl backdrop-blur-sm sm:flex">
				<a
					href="https://github.com/dev-xo/stripe-stack"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-row items-center text-base font-semibold text-gray-400 
					transition hover:text-gray-100 active:text-violet-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
					</svg>
					<div className="mx-1" />
					Docs
				</a>
				<div className="mx-4" />

				<Link
					to="/plans"
					prefetch="intent"
					className="flex flex-row items-center text-base font-semibold text-gray-400 
					transition hover:text-gray-100 active:text-violet-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round">
						<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
					</svg>
					<div className="mx-1" />
					Plans
				</Link>
				<div className="mx-4" />

				<a
					href="https://twitter.com/DanielKanem"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-row items-center text-base font-semibold text-gray-400 
					transition hover:text-gray-100 active:text-violet-200">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round">
						<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
					</svg>
					<div className="mx-1" />
					Author
				</a>
			</div>

			{/* Auth Handlers. */}
			<div className="flex flex-row items-center">
				{/* Sign In Form Button. */}
				{!user && location && location.pathname === '/' && (
					<Link
						to="/login"
						prefetch="intent"
						className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 text-base font-bold text-gray-200 
						transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
						<button>Sign In</button>
					</Link>
				)}

				{/* Log Out Form Button. */}
				{user && (
					<Form
						action="/auth/logout"
						method="post"
						className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 text-base font-bold text-gray-200 
						transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
						<button>Log Out</button>
					</Form>
				)}
			</div>
		</nav>
	)
}
