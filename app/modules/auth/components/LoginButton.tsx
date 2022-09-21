import { Link } from '@remix-run/react'

export const LoginButton = () => {
	return (
		<Link to="/login">
			<button
				className="h-9 text-sm font-bold text-slate-700
        transition hover:scale-105 active:scale-100 dark:text-slate-100">
				<span>Continue with Socials</span>
			</button>
		</Link>
	)
}
