import type { AuthSession } from '~/services/auth/session.server'
import { Link, Form } from '@remix-run/react'
import { Theme, useTheme } from 'remix-themes'

type ComponentProps = {
	user: AuthSession | null
}

export const Navigation = ({ user }: ComponentProps) => {
	const [theme, setTheme] = useTheme()
	const handleOnClickTheme = () =>
		setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))

	return (
		<nav className="z-20 flex w-full flex-row items-center py-6 px-8">
			{/* Logo Link. */}
			<Link
				to={user ? '/account' : '/'}
				className="group flex flex-row items-center">
				<div
					className="flex h-16 w-16 flex-row items-center justify-center rounded-2xl
					bg-violet-500 transition group-hover:scale-105 group-active:scale-100">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						className="h-12 w-12 fill-white">
						<path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.954-1.757 2.334-1.757 4 0 3.023 1.847 4.312 4.847 5.403 1.936.688 2.579 1.178 2.579 1.934 0 .732-.629 1.155-1.762 1.155-1.403 0-3.716-.689-5.231-1.578l-.674 4.157c1.304.732 3.705 1.488 6.197 1.488 1.976 0 3.624-.467 4.735-1.356 1.245-.977 1.89-2.422 1.89-4.289 0-3.091-1.889-4.38-4.935-5.468h.002z" />
					</svg>
				</div>
				<div className="ml-4" />
				<div className="flex flex-row items-center">
					<h2
						className="flex flex-row items-center text-2xl font-semibold text-gray-900 
						group-hover:brightness-125 dark:text-gray-100">
						Stripe
						<div className="ml-1" />
						<p className="text-violet-800 dark:text-violet-500">S</p>
						<p className="text-violet-700 dark:text-violet-500">t</p>
						<p className="text-violet-600 dark:text-violet-400">a</p>
						<p className="text-violet-500 dark:text-violet-300">c</p>
						<p className="text-violet-400 dark:text-violet-200">k</p>
					</h2>
					<div className="ml-3" />
					<span
						className="hidden max-h-6 flex-row items-center rounded-md border-[1px] border-gray-300 px-2
						text-base font-bold text-gray-500 dark:border-gray-600 dark:text-gray-300 sm:flex">
						2.1
					</span>
				</div>
			</Link>
			<div className="ml-0 sm:ml-6" />

			{/* Theme Switcher. */}
			<div className="flex w-full flex-row items-center justify-start">
				<button
					className="group flex flex-row items-center transition hover:scale-110 active:scale-100"
					onClick={handleOnClickTheme}>
					{theme === Theme.LIGHT ? (
						<>
							<svg
								className="h-6 w-6 fill-gray-600 group-hover:fill-gray-900"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z" />
							</svg>
							<div className="ml-2" />
							<span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900">
								Light
							</span>
						</>
					) : (
						<>
							<svg
								className="h-6 w-6 fill-gray-400 group-hover:fill-gray-100"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z" />
							</svg>
							<div className="ml-2" />
							<span className="text-sm font-semibold text-gray-400 group-hover:text-gray-100">
								Night
							</span>
						</>
					)}
				</button>
			</div>

			{/* Log Out Form Button. */}
			{user && (
				<Form action="/logout" method="post">
					<button
						className="flex h-9 flex-row items-center justify-center rounded-xl bg-gray-500 
						px-6 text-base font-bold text-white transition hover:scale-105 active:scale-100">
						<span>Logout</span>
					</button>
				</Form>
			)}
		</nav>
	)
}
