import type { MetaFunction, LoaderArgs, ActionArgs } from '@remix-run/node'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData, useActionData } from '@remix-run/react'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserByEmail } from '~/models/user.server'
import { encrypt, decrypt } from '~/services/auth/utils.server'
import { sendResetPasswordEmail } from '~/services/email/utils.server'
import { getDomainUrl } from '~/utils/misc.server'

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
import { HAS_SUCCESSFULLY_SEND_EMAIL } from '~/services/email/constants.server'

/**
 * Init - Constants.
 */
const queryTokenParam = 'token'
const queryTokenType = 'forgot-password'

/**
 * Zod - Schema.
 */
const RequestFormSchema = z.object({
	email: z.string().min(1, 'Email is required.').email('Email is invalid.'),
})

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Forgot Password',
	}
}

/**
 * Remix - Loader.
 */
export async function loader({ request }: LoaderArgs) {
	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))

	const hasSuccessfullySendEmail =
		session.get(HAS_SUCCESSFULLY_SEND_EMAIL) || false

	// Gets `token` param value from URL.
	const resetPasswordToken = new URL(request.url).searchParams.get(
		queryTokenParam,
	)

	if (resetPasswordToken) {
		// Decrypts URL `token`.
		const token = JSON.parse(decrypt(resetPasswordToken))

		// Validates token.
		if (token.type === queryTokenType && token.payload?.email) {
			// Sets a new value in Session.
			// Used on `/login/reset` route.
			session.set(RESET_PASSWORD_SESSION_KEY, token.payload.email)

			// Redirects commiting newly updated Session.
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

/**
 * Remix - Action.
 */
export async function action({ request }: ActionArgs) {
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
					const dbUser = await getUserByEmail({
						email,
					})
					if (!dbUser || !dbUser.email) throw new Error('User not found.')

					// Encrypts `email`.
					const resetPasswordToken = encrypt(
						JSON.stringify({ type: queryTokenType, payload: { email } }),
					)

					// Creates a new URL that points to the current route.
					const resetPasswordUrl = new URL(
						`${getDomainUrl(request)}/login/request`,
					)

					// Updates newly created URL including encrypted password.
					resetPasswordUrl.searchParams.set(queryTokenParam, resetPasswordToken)

					// Sends user an email with newly created URL.
					const responseEmail = await sendResetPasswordEmail({
						to: [{ email: dbUser.email }],
						subject: `Stripe Stack - Password Reset`,
						htmlContent: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
              <head>
                <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
              </head>
              <body>
                <h1>Reset your Stripe Stack password.</h1>
                <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
              </body>
            </html>
            `,
					})
					if (!responseEmail)
						throw new Error(
							'Whops! There was an error trying to send you a recovery email.',
						)

					// Sets a new value in Session, used to enhance UI experience.
					session.flash(HAS_SUCCESSFULLY_SEND_EMAIL, true)
				}
			}
		}
	} catch (error) {
		submission.error.push(...formatError(error))
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

export default function LoginRequestRoute() {
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
		<div className="flex w-full max-w-md flex-col">
			{/* Displays Has Successfully Send Email Message. */}
			{hasSuccessfullySendEmail && (
				<div
					className="select-noneflex-row absolute top-9 left-0 right-0 z-20 m-auto flex
					w-[400px] transform justify-center transition hover:scale-110">
					<p className="rounded-2xl bg-violet-500 p-2 px-12 font-bold text-white shadow-2xl">
						Email has been successfully sent.
					</p>
				</div>
			)}

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
