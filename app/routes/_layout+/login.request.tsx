import type { DataFunctionArgs } from '@remix-run/node'
import type { z } from 'zod'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData, useActionData } from '@remix-run/react'

import { getSession, commitSession } from '~/services/auth/session.server'
import { decrypt, encrypt } from '~/services/auth/utils/encryption.server'
import { sendResetPasswordEmail } from '~/services/email/utils/send-reset-password'
import { getUserByEmail } from '~/models/user/get-user'

import { getDomainUrl } from '~/lib/utils/http'
import { AUTH_KEYS, EMAIL_KEYS, MISC_KEYS } from '~/lib/constants'

import { formatError, validate } from '@conform-to/zod'
import { conform, parse, useFieldset, useForm, hasError } from '@conform-to/react'
import { RequestFormSchema } from '~/lib/validations/auth'

export async function loader({ request }: DataFunctionArgs) {
	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))

	const hasSuccessfullySendEmail =
		session.get(EMAIL_KEYS.HAS_SUCCESSFULLY_SEND_EMAIL) || false

	// Gets `token` param from URL.
	const resetPasswordToken = new URL(request.url).searchParams.get(
		MISC_KEYS.QUERY_TOKEN_PARAM,
	)

	if (resetPasswordToken) {
		// Decrypts URL `token`.
		const token = JSON.parse(decrypt(resetPasswordToken))

		if (
			token.type === MISC_KEYS.QUERY_TOKEN_FORGOT_PASSWORD &&
			token.payload?.email
		) {
			// Sets a new value in Session.
			session.set(AUTH_KEYS.RESET_PASSWORD_SESSION_KEY, token.payload.email)

			// Redirects committing newly updated Session.
			return redirect('/login/reset', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			})
		} else return redirect('/login/email')
	}

	return json(
		{ hasSuccessfullySendEmail },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export async function action({ request }: DataFunctionArgs) {
	const formData = await request.formData()
	const submission = parse<z.infer<typeof RequestFormSchema>>(formData)

	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))

	try {
		switch (submission.type) {
			case 'validate':
			case 'submit': {
				// Validates `submission` data.
				const { email } = RequestFormSchema.parse(submission.value)

				if (submission.type === 'submit') {
					// Checks for user existence in database.
					const dbUser = await getUserByEmail({ email })
					if (!dbUser || !dbUser.email) throw new Error('User not found.')

					// Encrypts `email`.
					const resetPasswordToken = encrypt(
						JSON.stringify({
							type: MISC_KEYS.QUERY_TOKEN_FORGOT_PASSWORD,
							payload: { email },
						}),
					)

					// Creates a new URL that points to the current route.
					const resetPasswordUrl = new URL(`${getDomainUrl(request)}/login/request`)

					// Updates newly created URL including encrypted password.
					resetPasswordUrl.searchParams.set(
						MISC_KEYS.QUERY_TOKEN_PARAM,
						resetPasswordToken,
					)

					// Sends user an email with newly created URL.
					const responseEmail = await sendResetPasswordEmail({
						to: [{ email: dbUser.email }],
						resetPasswordUrl,
					})
					if (!responseEmail) throw new Error('Email not sent.')

					// Sets a new value in Session, used to enhance UI experience.
					session.flash(EMAIL_KEYS.HAS_SUCCESSFULLY_SEND_EMAIL, true)
				}
			}
		}
	} catch (err: unknown) {
		console.log(err)
		submission.error.push(...formatError(err))
	}

	// Sends submission state back to the client.
	return json(
		{ ...submission },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function LoginRequest() {
	const { hasSuccessfullySendEmail } = useLoaderData<typeof loader>()

	const state = useActionData<typeof action>()
	const form = useForm<z.infer<typeof RequestFormSchema>>({
		// Enables server-side validation mode.
		mode: 'server-validation',

		// Begins validation on blur.
		initialReport: 'onBlur',

		// Syncs the result of last submission.
		state,

		// Validate `formData` based on Zod Schema.
		onValidate({ formData }) {
			return validate(formData, RequestFormSchema)
		},

		// Submits only if validation has successfully passed.
		onSubmit(event, { submission }) {
			if (submission.type === 'validate' && hasError(submission.error)) {
				event.preventDefault()
			}
		},
	})

	// Returns all the information about the fieldset.
	const { email } = useFieldset(form.ref, form.config)

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
					disabled={hasSuccessfullySendEmail}
					className={`relative flex h-14 w-full flex-row items-center justify-center rounded-xl
					text-base font-bold text-white transition hover:scale-105 active:scale-100 active:brightness-90 ${
						hasSuccessfullySendEmail ? 'bg-green-500' : 'bg-violet-500'
					}`}>
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
					</svg>

					<span>
						{hasSuccessfullySendEmail ? 'Email Sent!' : 'Request Password'}
					</span>
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
