import type { MetaFunction, LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Log In with Email',
	}
}

/**
 * Remix - Loader.
 * @required Template code.
 */
type LoaderData = {
	formError: string
}

export const loader = async ({ request }: LoaderArgs) => {
	// Checks for Auth Session.
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	})

	// Parses a Cookie and returns its associated Session.
	// Gets errors from Session.
	const session = await getSession(request.headers.get('cookie'))
	const error = session.get(authenticator.sessionErrorKey)

	return json<LoaderData>(
		{ formError: error?.message },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function LoginRoute() {
	const { formError } = useLoaderData<typeof loader>()

	return (
		<div className="flex w-full max-w-md flex-col">
			<Form method="post" action={`/auth/email`}>
				{/* Hidden Input. */}
				{/* Communicates our backend if user is trying to signup, or login. */}
				<input type="hidden" name="formType" value="login" />

				{/* Email Input. */}
				<div>
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Email
					</label>
					<div className="mb-1" />
					<input
						name="email"
						type="email"
						required
						className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
            px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

				{/* Password Input. */}
				<div className="">
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Password
					</label>
					<div className="mb-1" />
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						required
						className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
            px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

				{/* Displays Form error message. */}
				{formError && (
					<p className="rounded-2xl bg-red-500 p-2 px-4 font-bold text-white shadow-2xl">
						{formError}
					</p>
				)}
				<div className="mb-3" />

				<button
					type="submit"
					className="relative flex h-16 w-full flex-row items-center justify-center rounded-xl
					bg-slate-600 text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
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
					to="/login/forgot-password">
					Forgot password?
				</Link>

				<Link
					className="font-semibold text-gray-800 hover:opacity-60 dark:text-gray-100"
					to="/signup/email">
					Create account
				</Link>
			</div>
		</div>
	)
}
