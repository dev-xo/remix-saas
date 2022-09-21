import { Form } from '@remix-run/react'

export const LogoutButton = () => {
	return (
		<Form action="/auth/logout" method="post">
			<button
				className="h-9 text-sm font-bold text-slate-700
        transition hover:scale-105 active:scale-100 dark:text-slate-100">
				<span>Logout</span>
			</button>
		</Form>
	)
}
