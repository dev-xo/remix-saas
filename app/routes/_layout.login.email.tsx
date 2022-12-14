import type { DataFunctionArgs } from '@remix-run/node'
import type { z } from 'zod'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { validateHashPassword } from '~/services/auth/utils/encryption.server'
import { getUserByEmail } from '~/models/user/get-user'

import { formatError, validate } from '@conform-to/zod'
import { conform, parse, useFieldset, useForm, hasError } from '@conform-to/react'
import { LoginFormSchema } from '~/lib/validations/auth'

export async function action({ request }: DataFunctionArgs) {
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
							'Incorrect credentials. Please try again or select "Forgot password" to reset it.',
						)

					// Sets user on Session.
					const session = await getSession(request.headers.get('cookie'))
					session.set(authenticator.sessionKey, dbUser)

					// Redirects committing newly updated Session.
					return redirect('/account', {
						headers: { 'Set-Cookie': await commitSession(session, {}) },
					})
				}
			}
		}
	} catch (err: unknown) {
		console.log(err)
		submission.error.push(...formatError(err))
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

export default function LoginEmail() {
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
		<div className="flex w-full flex-col">
			<Form method="post" autoComplete="off" {...form.props}>
				<fieldset>
					{/* Email. */}
					<label className="font-semibold text-gray-200">
						<div>Email</div>
						<div className="mb-1" />

						<input
							type="email"
							placeholder="name@example.com"
							className="h-10 w-full border-b-2 border-gray-600 bg-transparent 
							text-lg font-semibold text-gray-200 focus:border-violet-200"
							{...conform.input(email.config)}
						/>
						<div className="mb-1" />

						<div className="text-violet-200">{email.error}</div>
					</label>
					<div className="mb-6" />

					{/* Password. */}
					<label className="font-semibold text-gray-200">
						<div>Password</div>
						<div className="mb-1" />

						<input
							type="password"
							className="h-10 w-full border-b-2 border-gray-600 bg-transparent 
							text-lg font-semibold text-gray-200 focus:border-violet-200"
							{...conform.input(password.config, { type: 'password' })}
						/>
						<div className="mb-1" />

						<div className="text-violet-200">{password.error}</div>
					</label>
				</fieldset>
				<div className="mb-2" />

				{/* Form Error Message. */}
				{form.error && (
					<>
						<legend className="w-full text-center font-bold text-violet-200 ">
							{form.error}
						</legend>
						<div className="mb-4" />
					</>
				)}

				{/* Submit. */}
				<button
					type="submit"
					className="relative flex h-14 w-full flex-row items-center justify-center rounded-xl bg-violet-500
					text-base font-bold text-white transition hover:scale-105 active:scale-100 active:brightness-90">
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
				{/* Forgot Password Link. */}
				<Link
					to="/login/request"
					prefetch="intent"
					className="font-semibold text-violet-200 hover:opacity-80">
					Forgot password?
				</Link>

				{/* Create Account Link. */}
				<Link
					to="/login/register"
					prefetch="intent"
					className="font-semibold text-violet-200 hover:opacity-80">
					Create account
				</Link>
			</div>
		</div>
	)
}
