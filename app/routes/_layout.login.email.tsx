import type { MetaFunction, ActionArgs } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserByEmail } from '~/models/user.server'
import { validateHashPassword } from '~/services/auth/utils.server'

import { z } from 'zod'
import { formatError, validate } from '@conform-to/zod'
import {
	conform,
	parse,
	useFieldset,
	useForm,
	hasError,
} from '@conform-to/react'

/**
 * Zod - Schema.
 */
const LoginFormSchema = z.object({
	email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
	password: z.string().min(1, 'Password is required.'),
})

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Log In with Email',
	}
}

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
	const formData = await request.formData()
	const submission = parse<z.infer<typeof LoginFormSchema>>(formData)

	try {
		switch (submission.type) {
			case 'validate':
			case 'submit': {
				// Validates `submission` data.
				const { email, password } = LoginFormSchema.parse(submission.value)

				if (submission.type === 'submit') {
					// Checks for user existence in database.
					const dbUser = await getUserByEmail({
						email,
						include: {
							password: true,
							subscription: true,
						},
					})
					if (!dbUser || !dbUser.password) throw new Error('User not found.')

					// Validates provided credentials with database ones.
					const isPasswordValid = await validateHashPassword(
						password,
						dbUser.password.hash,
					)
					if (!isPasswordValid)
						throw new Error(
							'Incorrect password. Please try again or select "Forgot password" to change it.',
						)

					// Sets user as Auth Session.
					const session = await getSession(request.headers.get('cookie'))
					session.set(authenticator.sessionKey, dbUser)

					// Redirects commiting newly updated Session.
					return redirect('/account', {
						headers: { 'Set-Cookie': await commitSession(session, {}) },
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

		value: {
			// Never send password back to the client.
			email: submission.value.email,
		},
	})
}

export default function LoginEmailRoute() {
	const state = useActionData<typeof action>()
	const form = useForm<z.infer<typeof LoginFormSchema>>({
		// Enables server-side validation mode.
		mode: 'server-validation',

		// Begins validation on blur.
		initialReport: 'onBlur',

		// Syncs the result of last submission.
		state,

		// Validate `formData` based on Zod Schema.
		onValidate({ formData }) {
			return validate(formData, LoginFormSchema)
		},

		// Submits only if validation has successfully passed.
		onSubmit(event, { submission }) {
			if (submission.type === 'validate' && hasError(submission.error)) {
				event.preventDefault()
			}
		},
	})

	// Returns all the information about the fieldset.
	const { email, password } = useFieldset(form.ref, form.config)

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

					{/* Email. */}
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						<div>Email</div>
						<div className="mb-1" />

						<input
							{...conform.input(email.config)}
							className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
            	px-4 text-base font-semibold text-black transition dark:text-white"
						/>
						<div className="text-violet-500">{email.error}</div>
					</label>
					<div className="mb-3" />

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

					<span>Continue</span>
				</button>
			</Form>
			<div className="mb-4" />

			<div className="flex flex-row justify-between">
				<Link
					className="font-semibold text-gray-800 hover:opacity-60 dark:text-gray-100"
					to="/login/request">
					Forgot password?
				</Link>

				<Link
					className="font-semibold text-gray-800 hover:opacity-60 dark:text-gray-100"
					to="/login/register">
					Create account
				</Link>
			</div>
		</div>
	)
}
