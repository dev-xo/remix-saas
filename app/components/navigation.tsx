import type { AuthSession } from '~/modules/auth'
import { useLocation, Link } from '@remix-run/react'
import { LoginButton, LogoutButton } from '~/modules/auth/components'

type ComponentProps = {
	user: AuthSession | null
}

export const Navigation = ({ user }: ComponentProps) => {
	const location = useLocation()

	return (
		<nav className="z-20 flex w-full flex-row items-center justify-end py-4 px-6">
			{/* Left Navigation */}
			{!user && (
				<Link to="/" className="h-8">
					<svg
						viewBox="0 0 800 800"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="absolute left-3 top-3 h-10 transition
            duration-100 hover:scale-110 hover:opacity-100 active:scale-90">
						<rect width="800" height="800" />
						<path
							d="M587.947 527.768C592.201 582.418 592.201 608.036 592.201 636H465.756C465.756 629.909 465.865 624.337 465.975 618.687C466.317 601.123 466.674 582.807 463.828 545.819C460.067 491.667 436.748 479.634 393.871 479.634H355.883H195V381.109H399.889C454.049 381.109 481.13 364.633 481.13 321.011C481.13 282.654 454.049 259.41 399.889 259.41H195V163H422.456C545.069 163 606 220.912 606 313.42C606 382.613 563.123 427.739 505.201 435.26C554.096 445.037 582.681 472.865 587.947 527.768Z"
							className="fill-slate-900 dark:fill-slate-100"
						/>
						<path
							d="M195 636V562.553H328.697C351.029 562.553 355.878 579.116 355.878 588.994V636H195Z"
							className="fill-slate-900 dark:fill-slate-100"
						/>
						<path
							d="M194.5 636V636.5H195H355.878H356.378V636V588.994C356.378 583.988 355.152 577.26 351.063 571.77C346.955 566.255 340.004 562.053 328.697 562.053H195H194.5V562.553V636Z"
							stroke="white"
							strokeOpacity="0.8"
							className="fill-slate-900 dark:fill-slate-100"
						/>
					</svg>
				</Link>
			)}

			{user && location.pathname === '/plans' && (
				<Link to="/account">
					<button
						className="absolute left-5 top-5 rounded-xl bg-slate-700 px-3 py-1 text-sm font-bold
						text-slate-100 transition hover:scale-105 active:scale-100">
						<span>Back</span>
					</button>
				</Link>
			)}

			{/* Right Navigation */}
			<div className="flex flex-row items-center">
				<a
					href="https://github.com/dev-xo/stripe-stack"
					target="_blank"
					rel="noopener noreferrer">
					<svg
						className="h-8 w-8 fill-slate-800 transition hover:scale-110 active:scale-100 dark:fill-slate-100"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
						/>
					</svg>
				</a>
				{location.pathname !== '/login' && <div className="mx-2" />}

				{user && (
					<>
						<Link to="/plans">
							<button
								className="rounded-xl bg-purple-700 px-3 py-1 text-sm font-bold
        				text-slate-100 transition hover:scale-105 active:scale-100">
								<span>Plans</span>
							</button>
						</Link>
						<div className="mx-2" />
					</>
				)}

				{/* Authentication. */}
				{!user && location.pathname !== '/login' && <LoginButton />}
				{user && <LogoutButton />}
			</div>
		</nav>
	)
}
