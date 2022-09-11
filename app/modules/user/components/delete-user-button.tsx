import { Form } from '@remix-run/react'

export const DeleteUserButton = () => {
	return (
		<Form action="/resources/user/delete-user" method="post">
			<button
				className="h-8 font-bold text-red-500 transition hover:scale-105
				hover:opacity-50 active:scale-100">
				<span>Delete Account</span>
			</button>
		</Form>
	)
}
