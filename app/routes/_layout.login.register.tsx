import type { DataFunctionArgs } from '@remix-run/node'
import type { z } from 'zod'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { hashPassword } from '~/services/auth/utils/encryption.server'
import { getUserByEmail } from '~/models/user/get-user'
import { createEmailUser } from '~/models/user/create-user'

import { formatError, validate } from '@conform-to/zod'
import { conform, parse, useFieldset, useForm, hasError } from '@conform-to/react'
import { RegisterFormSchema } from '~/lib/validations/auth'

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = parse<z.infer<typeof RegisterFormSchema>>(formData)

	try {
		switch (submission.type) {
			case 'validate':
			case 'submit': {
				// Validates `submission` data.
				const { name, email, password } = RegisterFormSchema.parse(submission.value)

				if (submission.type === 'submit') {
					// Checks if email is already in use.
					const dbUser = await getUserByEmail({
						email,
						include: {
							subscription: true,
						},
					})
					if (dbUser && dbUser.email === email)
						submission.error.push(['email', 'Email is already in use.'])

					// Hashes password.
					const hashedPassword = await hashPassword(password)

					// Creates and stores a new user in database.
					const newUser = await createEmailUser({
						user: {
							name,
							email,
							avatar: `https://ui-avatars.com/api/?&name=${name}&background=random`,
						},
						hashedPassword: hashedPassword,
						include: {
							subscription: true,
						},
					})
					if (!newUser) submission.error.push(['email', 'Something went wrong.'])

					// Sets newly created user on Session.
					const session = await getSession(request.headers.get('cookie'))
					session.set(authenticator.sessionKey, newUser)

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

export default function LoginRegister() {
	const state = useActionData<typeof action>()
	const form = useForm<z.infer<typeof RegisterFormSchema>>({
		// Enables server-side validation mode.
		mode: 'server-validation',

		// Begins validation on blur.
		initialReport: 'onBlur',

		// Syncs the result of last submission.
		state,

		// Validate `formData` based on Zod Schema.
		onValidate({ formData }) {
			return validate(formData, RegisterFormSchema)
		},

		// Submits only if validation has successfully passed.
		onSubmit(event, { submission }) {
			if (submission.type === 'validate' && hasError(submission.error)) {
				event.preventDefault()
			}
		},
	})

	// Returns all the information about the fieldset.
	const { name, email, password, confirmPassword } = useFieldset(
		form.ref,
		form.config,
	)

	return (
		<div className="flex w-full flex-col">
			<Form method="post" autoComplete="off" {...form.props}>
				<fieldset>
					{/* Name. */}
					<label className="font-semibold text-gray-200">
						<div>Name</div>
						<div className="mb-1" />

						<input
							placeholder="John Doe"
							className="h-10 w-full border-b-2 border-gray-600 bg-transparent 
							text-lg font-semibold text-gray-200 focus:border-violet-200"
							{...conform.input(name.config)}
						/>
						<div className="mb-1" />

						<div className="text-violet-200">{name.error}</div>
					</label>
					<div className="mb-6" />

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
					<div className="mb-2" />

					{/* Confirm Password. */}
					<label className="font-semibold text-gray-200">
						<div>Confirm Password</div>
						<div className="mb-1" />

						<input
							type="password"
							className="h-10 w-full border-b-2 border-gray-600 bg-transparent 
							text-lg font-semibold text-gray-200 focus:border-violet-200"
							{...conform.input(confirmPassword.config, { type: 'password' })}
						/>
						<div className="mb-1" />

						<div className="text-violet-200">{confirmPassword.error}</div>
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

					<span>Create Account</span>
				</button>
			</Form>
			<div className="mb-4" />

			<div className="flex flex-row justify-end">
				{/* Create Account Link. */}
				<Link
					to="/login/email"
					prefetch="intent"
					className="font-semibold text-violet-200 hover:opacity-80">
					Already have an account?
				</Link>
			</div>
		</div>
	)
}
