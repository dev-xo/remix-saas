import type { MetaFunction, LoaderArgs, ActionArgs } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserByEmail } from '~/models/user.server'
import { updateUserPassword } from '~/models/user.server'
import { hashPassword } from '~/services/auth/utils.server'

import { z } from 'zod'
import { formatError, validate } from '@conform-to/zod'
import {
	conform,
	parse,
	useFieldset,
	useForm,
	hasError,
} from '@conform-to/react'

import { RESET_PASSWORD_SESSION_KEY } from '~/services/auth/constants.server'

/**
 * Zod - Schema.
 */
const ResetFormSchema = z
	.object({
		password: z.string().min(1, 'Password is required.'),
		confirmPassword: z.string().min(1, 'Confirm password is required.'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords does not match.',
		path: ['confirmPassword'],
	})

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Reset Password',
	}
}

/**
 * Remix - Loader.
 */
export async function loader({ request }: LoaderArgs) {
	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))
	const resetPasswordSessionKey = session.get(RESET_PASSWORD_SESSION_KEY)

	// Requires `RESET_PASSWORD_SESSION_KEY` to be in Session.
	// This validates that user has been successfully redirected from Email.
	if (!resetPasswordSessionKey) return redirect('/login')

	// Returns a JSON Response commiting Session.
	return json({
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	})
}

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
	const formData = await request.formData()
	const submission = parse<z.infer<typeof ResetFormSchema>>(formData)

	try {
		switch (submission.type) {
			case 'validate':
			case 'submit': {
				// Validates `submission` data.
				const { password } = ResetFormSchema.parse(submission.value)

				if (submission.type === 'submit') {
					// Gets values from Session.
					const session = await getSession(request.headers.get('Cookie'))

					const email = session.get(RESET_PASSWORD_SESSION_KEY)
					if (!email) return redirect('/login')

					// Checks for user existence in database.
					const dbUser = await getUserByEmail({
						email,
						include: {
							password: true,
						},
					})
					if (!dbUser || !dbUser?.email || !dbUser.password)
						return redirect('/login')

					// Hashes newly password.
					const hashedPassword = await hashPassword(password)

					// Resets user password.
					await updateUserPassword({ email, hashedPassword })

					// Cleanup Session.
					session.unset(RESET_PASSWORD_SESSION_KEY)

					// Redirects commiting newly updated Session.
					return redirect('/login/email', {
						headers: { 'Set-Cookie': await commitSession(session) },
					})
				}
			}
		}
	} catch (error) {
		submission.error.push(...formatError(error))
	}

	// Sends submission state back to the client.
	return json({
		...submission,
		value: {},
	})
}

export default function LoginResetRoute() {
	const state = useActionData<typeof action>()
	const form = useForm<z.infer<typeof ResetFormSchema>>({
		// Enables server-side validation mode.
		mode: 'server-validation',

		// Begins validation on blur.
		initialReport: 'onBlur',

		// Syncs the result of last submission.
		state,

		// Validate `formData` based on Zod Schema.
		onValidate({ formData }) {
			return validate(formData, ResetFormSchema)
		},

		// Submits only if validation has successfully passed.
		onSubmit(event, { submission }) {
			if (submission.type === 'validate' && hasError(submission.error)) {
				event.preventDefault()
			}
		},
	})

	// Returns all the information about the fieldset.
	const { password, confirmPassword } = useFieldset(form.ref, form.config)

	return (
		<div className="flex w-full max-w-md flex-col">
			<Form method="post" {...form.props} autoComplete="off">
				<fieldset>
					{/* Displays Form error message. */}
					{form.error && (
						<legend
							className="flex w-full flex-row justify-center rounded-2xl
							bg-red-500 p-2 px-4 font-bold text-white shadow-2xl">
							{form.error}
						</legend>
					)}

					{/* Password. */}
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						<div>Password</div>
						<div className="mb-1" />

						<input
							{...conform.input(password.config, { type: 'password' })}
							className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
            	px-4 text-base font-semibold text-black transition dark:text-white"
						/>
						<div className="text-violet-500">{password.error}</div>
					</label>

					{/* Confirm Password. */}
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						<div>Confirm Password</div>
						<div className="mb-1" />

						<input
							{...conform.input(confirmPassword.config, { type: 'password' })}
							className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
            	px-4 text-base font-semibold text-black transition dark:text-white"
						/>
						<div className="text-violet-500">{confirmPassword.error}</div>
					</label>
				</fieldset>
				<div className="mb-3" />

				{/* Submit. */}
				<button
					type="submit"
					className="relative flex h-16 w-full flex-row items-center justify-center rounded-xl bg-slate-600
					text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
					</svg>

					<span>Reset password</span>
				</button>
			</Form>
			<div className="mb-4" />

			<div className="flex flex-row justify-end">
				<Link
					className="font-semibold text-gray-800 hover:opacity-60 dark:text-gray-100"
					to="/login/email">
					Already have an account?
				</Link>
			</div>
		</div>
	)
}
