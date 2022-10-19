import { Form } from '@remix-run/react'

export const DeleteUserButton = () => {
	return (
		<Form action="/resources/user/delete-user" method="post">
			<button
				className="flex h-9 flex-row items-center justify-center rounded-xl 
				bg-red-500 px-6 text-base font-bold text-white transition hover:scale-105 active:scale-100">
				<span>Delete Account</span>
			</button>
		</Form>
	)
}
