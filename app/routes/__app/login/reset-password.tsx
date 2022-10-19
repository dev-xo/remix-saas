import type {
	MetaFunction,
	LoaderFunction,
	ActionFunction,
} from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Link, useFetcher } from '@remix-run/react';
import { authenticator } from '~/services/auth/config.server';
import { getSession, commitSession } from '~/services/auth/session.server';
import {
	getUserByEmailIncludingPassword,
	resetUserPassword,
} from '~/models/user.server';
import { RESET_PASSWORD_SESSION_KEY } from './forgot-password';

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Reset Password',
	};
};

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request, params }) => {
	// Checks for Auth Session.
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	});

	// Parses a Cookie and returns its associated Session.
	const session = await getSession(request.headers.get('cookie'));

	// Gets values from Session.
	const error = session.get(authenticator.sessionErrorKey);
	const resetPasswordEmail = session.get(RESET_PASSWORD_SESSION_KEY);

	if (!resetPasswordEmail || typeof resetPasswordEmail !== 'string')
		return redirect('/login');

	// Returns a JSON Response commiting Session.
	return json(
		{ formError: error?.message, resetPasswordEmail },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
};

/**
 * Remix - Action.
 * @required Template code.
 */
export const action: ActionFunction = async ({ request, params }) => {
	// Gets values from `formData`.
	const formData = await request.clone().formData();
	const { password, confirmPassword } = Object.fromEntries(formData);

	// Validates `formData` values.
	// This could be extended with libraries like: https://zod.dev
	if (
		!password ||
		!confirmPassword ||
		typeof password !== 'string' ||
		typeof confirmPassword !== 'string'
	)
		return json(
			{
				formError: {
					error: {
						message: 'Passwords does not match our required criteria.',
					},
				},
			},
			{ status: 400 },
		);

	if (password !== confirmPassword)
		return json(
			{
				formError: {
					error: {
						message: 'Passwords does not match.',
					},
				},
			},
			{ status: 400 },
		);

	// Parses a Cookie and returns its associated Session.
	const session = await getSession(request.headers.get('cookie'));

	// Gets values from Session.
	const email = session.get(RESET_PASSWORD_SESSION_KEY);
	if (!email || typeof email !== 'string') return redirect('/login');

	// Checks for User existence in database.
	const dbUser = await getUserByEmailIncludingPassword(email);
	if (!dbUser?.email || !dbUser.password) return redirect('/login');

	// Resets User password.
	await resetUserPassword(email, password);

	// Removes a value from the Session.
	session.unset(RESET_PASSWORD_SESSION_KEY);

	// Returns a JSON Response commiting Session.
	return redirect('/login/email', {
		headers: { 'Set-Cookie': await commitSession(session) },
	});
};

export default function ResetPasswordRoute() {
	const fetcher = useFetcher();
	const { formError } = fetcher.data || {};

	return (
		<div className="flex w-full max-w-md flex-col">
			<fetcher.Form method="post">
				{/* Password Input */}
				<div>
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Password
					</label>
					<div className="mb-1" />
					<input
						name="password"
						type="password"
						autoComplete="new-password"
						required
						className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
              px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

				{/* Confirm Password Input */}
				<div>
					<label className="font-semibold text-gray-800 dark:text-gray-100">
						Confirm Password
					</label>
					<div className="mb-1" />
					<input
						name="confirmPassword"
						type="password"
						autoComplete="current-password"
						required
						className="flex h-16 w-full rounded-xl border-2 border-gray-500 bg-transparent
              px-4 text-base font-semibold text-black transition dark:text-white"
					/>
				</div>
				<div className="mb-3" />

				{formError?.error?.message && (
					<p className="rounded-2xl bg-red-500 p-2 px-4 font-bold text-white shadow-2xl">
						{formError.error.message}
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

					<span>{fetcher.state === 'idle' ? 'Submit' : 'Submitting...'}</span>
				</button>
			</fetcher.Form>
			<div className="mb-4" />

			<div className="flex flex-row justify-end">
				<Link
					className="font-semibold text-gray-800 hover:opacity-60 dark:text-gray-100"
					to="/login/email">
					Already have an account?
				</Link>
			</div>
		</div>
	);
}
