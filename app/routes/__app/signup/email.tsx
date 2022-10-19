import type { MetaFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Sign Up with Email',
	}
}

type LoaderData = {
	formError: string
}

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// Checks for Auth Session.
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	})

	// Parses a Cookie and returns its associated Session.
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

export default function SignupEmailRoute() {
	const { formError } = useLoaderData() as LoaderData

	return (
		<div className="relative flex w-full max-w-md flex-col">
			<Form method="post" action={`/auth/email`}>
				{/* Hidden Input. */}
				{/* Communicates our backend if user is trying to signup, or login. */}
				<input type="hidden" name="formType" value="signup" />

				{/* Name Input */}
				<div>
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Name
					</label>
					<div className="mb-1" />
					<input
						name="name"
						type="text"
						required
						className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
              px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

				{/* Email Input */}
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

				{/* Password Input */}
				<div>
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Password
					</label>
					<div className="mb-1" />
					<input
						name="password"
						type="password"
						autoComplete="current-password"
						required
						className="relative flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
              px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

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

					<span>Create account</span>
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
			<div className="mb-4" />

			{/* Example Privacy Message. */}
			<p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
				By clicking “Continue" you acknowledge that this is a{' '}
				<span className="font-bold text-gray-800 hover:opacity-60 dark:text-gray-100">
					simple demo
				</span>
				, and you are free to use it in the way you like.
			</p>
		</div>
	)
}
