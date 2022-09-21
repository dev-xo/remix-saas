import { Theme, useTheme } from 'remix-themes'

export const Footer = () => {
	const [theme, setTheme] = useTheme()
	const handleOnClickTheme = () =>
		setTheme((prev) => (prev === Theme.DARK ? Theme.LIGHT : Theme.DARK))

	return (
		<footer className="z-10 flex flex-col items-center p-8">
			<div
				className="fixed bottom-4 flex select-none flex-row items-center justify-between 
        rounded-2xl bg-[rgba(255,255,255,0.5)] p-3 px-6 shadow-2xl backdrop-blur-sm 
        transition hover:scale-105 dark:bg-[rgba(0,0,0,0.5)]">
				{/* Socials. */}
				<div className="flex flex-row items-center">
					<div className="flex flex-col">
						<p className="text-sm font-semibold text-slate-400 dark:text-slate-400">
							<span className="hidden sm:inline-block">Discover</span> Remix
						</p>
					</div>
					<div className="mx-3" />

					<div className="flex flex-row items-center">
						<a
							href="https://github.com/remix-run"
							target="_blank"
							rel="noopener noreferrer">
							<svg
								className="h-6 w-6 fill-slate-400 transition hover:scale-110
								hover:fill-slate-900 active:scale-100 dark:fill-slate-400 dark:hover:fill-slate-100"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
								/>
							</svg>
						</a>
						<div className="w-3" />

						<a
							href="https://twitter.com/remix_run"
							target="_blank"
							rel="noopener noreferrer">
							<svg
								className="h-6 w-6 fill-slate-400 transition hover:scale-110
								hover:fill-slate-900 active:scale-100 dark:fill-slate-400 dark:hover:fill-slate-100"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
							</svg>
						</a>
						<div className="w-3" />

						<a
							href="https://discord.com/invite/remix"
							target="_blank"
							rel="noopener noreferrer">
							<svg
								className="h-6 w-6 fill-slate-400 transition hover:scale-110
								hover:fill-slate-900 active:scale-100 dark:fill-slate-400 dark:hover:fill-slate-100"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z" />
							</svg>
						</a>
					</div>
				</div>
				<div className="mx-3" />

				{/* Separator. */}
				<div className="h-6 w-[1px] bg-slate-300 dark:bg-slate-700" />
				<div className="mx-3" />

				{/* Theme Switcher. */}
				<div className="flex flex-row items-center">
					<button onClick={handleOnClickTheme}>
						{theme === Theme.LIGHT ? (
							<svg
								className="h-6 w-6 fill-slate-400 transition hover:scale-110 hover:fill-slate-900
                active:scale-100 dark:fill-slate-400 dark:hover:fill-slate-100"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M12 11.807A9.002 9.002 0 0 1 10.049 2a9.942 9.942 0 0 0-5.12 2.735c-3.905 3.905-3.905 10.237 0 14.142 3.906 3.906 10.237 3.905 14.143 0a9.946 9.946 0 0 0 2.735-5.119A9.003 9.003 0 0 1 12 11.807z" />
							</svg>
						) : (
							<svg
								className="h-6 w-6 fill-slate-400 transition hover:scale-110 hover:fill-slate-900
                active:scale-100 dark:fill-slate-400 dark:hover:fill-slate-100"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M6.995 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007-2.246-5.007-5.007-5.007S6.995 9.239 6.995 12zM11 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2H2zm17 0h3v2h-3zM5.637 19.778l-1.414-1.414 2.121-2.121 1.414 1.414zM16.242 6.344l2.122-2.122 1.414 1.414-2.122 2.122zM6.344 7.759 4.223 5.637l1.415-1.414 2.12 2.122zm13.434 10.605-1.414 1.414-2.122-2.122 1.414-1.414z" />
							</svg>
						)}
					</button>
				</div>
			</div>
		</footer>
	)
}
