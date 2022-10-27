import type { MetaFunction, LoaderArgs, ActionArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Link, useLoaderData, useFetcher } from '@remix-run/react';
import { authenticator } from '~/services/auth/config.server';
import { getSession, commitSession } from '~/services/auth/session.server';
import { getUserByEmailIncludingPassword } from '~/models/user.server';
import { encrypt, decrypt } from '~/services/auth/utils.server';
import { sendRecoveryEmail } from '~/services/email/utils.server';
import { getDomainUrl } from '~/utils/misc.server';

/**
 * Remix - Meta.
 */
export const meta: MetaFunction = () => {
	return {
		title: 'Stripe Stack - Forgot Password',
	};
};

/**
 * Consts.
 */
export const RESET_PASSWORD_SESSION_KEY = 'RESET_PASSWORD_SESSION_KEY';
const queryTokenParam = 'token';
const queryTokenType = 'forgot-password';

/**
 * Remix - Loader.
 * @required Template code.
 */
type LoaderData = {
	hasSuccessfullySendEmail: boolean | null;
};

export const loader = async ({ request }: LoaderArgs) => {
	// Checks for Auth Session.
	await authenticator.isAuthenticated(request, {
		successRedirect: '/account',
	});

	// Parses a Cookie and returns its associated Session.
	// Gets flash values from Session.
	const session = await getSession(request.headers.get('Cookie'));
	const hasSuccessfullySendEmail =
		session.get('HAS_SUCCESSFULLY_SEND_EMAIL') || false;

	// Gets `token` param value from current URL.
	const resetPasswordToken = new URL(request.url).searchParams.get(
		queryTokenParam,
	);

	if (resetPasswordToken) {
		// Decrypts URL `token`.
		const token = JSON.parse(decrypt(resetPasswordToken));

		// On decrypt:
		// - Sets a value in Session that contains User Email.
		// - Commits Session and redirects with updated headers.
		if (token.type === queryTokenType && token.payload?.email) {
			session.set(RESET_PASSWORD_SESSION_KEY, token.payload.email);

			return redirect('/login/reset-password', {
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			});
		} else return redirect('/login');
	}

	// Returns a JSON Response and resets flashing Session variables.
	return json<LoaderData>(
		{
			hasSuccessfullySendEmail,
		},
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
type FetcherData = {
	formError: {
		error: {
			message: string;
		};
	};
};

export const action = async ({ request }: ActionArgs) => {
	// Gets values from `formData`.
	const formData = await request.clone().formData();
	const { email } = Object.fromEntries(formData);

	// Validates `formData` values.
	// This could be extended with libraries like: https://zod.dev
	if (typeof email !== 'string' || !email.includes('@'))
		return json(
			{
				formError: {
					error: {
						message: 'Email does not match our required criteria.',
					},
				},
			},
			{ status: 400 },
		);

	// Checks for User existence in database.
	const dbUser = await getUserByEmailIncludingPassword(email);

	if (!dbUser || !dbUser?.email || !dbUser.name)
		return json(
			{
				formError: {
					error: {
						message: 'Whops! User not found.',
					},
				},
			},
			{ status: 400 },
		);

	// Creates and encrypts a `JSON` object.
	const resetPasswordToken = encrypt(
		JSON.stringify({ type: queryTokenType, payload: { email } }),
	);

	// Creates a new Object URL.
	const resetPasswordUrl = new URL(
		`${getDomainUrl(request)}/login/forgot-password`,
	);

	// Sets newly encrypted 'token' as params.
	resetPasswordUrl.searchParams.set(queryTokenParam, resetPasswordToken);

	// Sends User an Email with newly created URL.
	const responseEmail = await sendRecoveryEmail({
		to: [
			{
				email: dbUser.email,
				name: dbUser.name,
			},
		],
		subject: `Stripe Stack - Password Reset`,
		htmlContent: `
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
			</head>
			<body>
				<h1>Reset your Stripe Stack password.</h1>
				<p>Click the link below to reset the password for ${dbUser.name}.</p>
				<a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
			</body>
		</html>
		`,
	});

	if (!responseEmail)
		return json(
			{
				formError: {
					error: {
						message:
							'Whops! There was an Error trying to send the recovery email.',
					},
				},
			},
			{ status: 400 },
		);

	// Sets a value in the session that is only valid until the next session.get().
	// Used to enhance UI experience.
	const session = await getSession(request.headers.get('Cookie'));
	session.flash('HAS_SUCCESSFULLY_SEND_EMAIL', true);

	// Returns a JSON Response commiting Session.
	return json(
		{ success: true },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
};

export default function ForgotPasswordRoute() {
	const { hasSuccessfullySendEmail } = useLoaderData<typeof loader>();
	const fetcher = useFetcher<FetcherData>();
	const { formError } = fetcher.data || {};

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

			<fetcher.Form method="post">
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

				{/* Displays Form error message. */}
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

					<span>{fetcher.state === 'idle' ? 'Submit' : 'Submitting ...'}</span>
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
