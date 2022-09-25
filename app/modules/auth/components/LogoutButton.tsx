import { Form } from '@remix-run/react'

export const LogoutButton = () => {
	return (
		<Form action="/auth/logout" method="post">
			<button
				className="flex h-9 flex-row items-center justify-center rounded-xl 
				bg-gray-500 px-6 text-base font-bold text-white transition hover:scale-105 active:scale-100">
				<span>Logout</span>
			</button>
		</Form>
	)
}
