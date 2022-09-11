import type { LoaderFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/modules/auth'
import { SocialsProvider } from 'remix-auth-socials'
import { SocialButton } from '~/modules/auth/components'

/**
 * Remix - Loader.
 * @protected Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	/**
	 * Checks for Auth Session.
	 */
	const user = await authenticator.isAuthenticated(request)

	/**
	 * On Auth Session: Redirects to `/`.
	 */
	if (user) return redirect('/account')

	return json({})
}

export default function LoginRoute() {
	return (
		<div className="flex h-full flex-col items-center justify-center px-6">
			{/* Headers. */}
			<div className="flex w-full max-w-md flex-col">
				<h5 className="text-left text-3xl font-bold text-slate-900 dark:text-slate-100">
					Remix
				</h5>
				<div className="mb-1" />
				<h5 className="text-left text-3xl font-semibold text-slate-500 dark:text-slate-400">
					Get joyful and productive with Social{' '}
					<span className="text-slate-900 dark:text-slate-100">
						Authentication.
					</span>
				</h5>
			</div>
			<div className="mb-3" />

			{/* Auth Buttons. */}
			<div className="flex w-full max-w-md flex-col">
				{/* Google. */}
				<SocialButton
					provider={SocialsProvider.GOOGLE}
					className="relative flex h-14 w-full flex-row items-center justify-center rounded-xl 
					bg-[#4285f4] text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
					</svg>

					<span>Continue with Google</span>
				</SocialButton>
				<div className="mb-1" />

				{/* Twitter. */}
				<SocialButton
					provider="twitter"
					className="relative flex h-14 w-full flex-row items-center justify-center rounded-xl 
					bg-[#1da1f2] text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
					</svg>

					<span>Continue with Twitter</span>
				</SocialButton>
				<div className="mb-1" />

				{/* Discord. */}
				<SocialButton
					provider={SocialsProvider.DISCORD}
					className="relative flex h-14 w-full flex-row items-center justify-center rounded-xl
					bg-[#7289da] text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z" />
					</svg>

					<span>Continue with Discord</span>
				</SocialButton>
				<div className="mb-1" />

				{/* Github. */}
				<SocialButton
					provider={SocialsProvider.GITHUB}
					className="relative flex h-14 w-full flex-row items-center justify-center rounded-xl 
					bg-[#2b3137] text-base font-bold text-white shadow-md transition hover:scale-105 active:scale-100">
					<svg
						className="absolute left-6 h-6 w-6 fill-white"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
						/>
					</svg>

					<span>Continue with Github</span>
				</SocialButton>
				<div className="mb-4" />

				{/* Example Privacy Message. */}
				<p className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
					By clicking “Continue" you acknowledge that this is a{' '}
					<span className="font-bold text-slate-900 hover:opacity-60 dark:text-slate-100">
						simple demo
					</span>
					, and you are free to use it in the way you like.
				</p>
			</div>
		</div>
	)
}
