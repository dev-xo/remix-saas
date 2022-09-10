export default function AppIndexRoute() {
	return (
		<div className="my-12 flex h-auto flex-col items-center justify-center px-6 sm:m-0 sm:h-full">
			{/* Intro. */}
			<div className="flex flex-col items-center">
				<div className="transition hover:scale-110 active:scale-100">
					<a
						href="https://stripe.com"
						target="_blank"
						rel="noopener noreferrer">
						<img
							src="https://cdn.iconscout.com/icon/free/png-256/stripe-2-498440.png"
							alt=""
							className="pulse z-10 h-16 w-16 cursor-pointer select-none drop-shadow-xl hue-rotate-15 hover:opacity-80 sm:h-24 sm:w-24"
						/>
					</a>
				</div>
				<div className="m-3" />

				<div className="flex flex-col items-center">
					<h1 className="text-3xl font-light text-slate-900 drop-shadow-md dark:text-slate-100">
						<span className="font-semibold text-slate-900 dark:text-slate-100">
							Remix
						</span>{' '}
						Stacks
					</h1>
					<div className="mb-1" />
					<p
						className="cursor-default text-sm font-semibold text-slate-700
            drop-shadow-sm hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
						Open Source Template
					</p>
				</div>
				<div className="m-2" />

				<div className="relative flex flex-col items-center">
					<h1 className="text-5xl font-bold text-slate-900 drop-shadow-xl dark:text-slate-100 sm:text-6xl">
						<span className="hidden lg:inline-block">Stripe</span> Subscriptions
					</h1>
					<h1 className="text-5xl font-bold text-slate-700 drop-shadow-xl dark:text-slate-300 sm:text-6xl">
						made simpler
						<span className="absolute -right-4 font-mono sm:-right-8">.</span>
					</h1>
				</div>
				<div className="m-3" />

				<p
					className="max-w-lg text-center text-lg font-medium text-slate-700 opacity-80
          drop-shadow-sm dark:text-slate-300">
					Experience a fully customizable template, carefully developed, ready
					for production.
				</p>
				<div className="m-3" />

				<a
					href="https://github.com/dev-xo/stripe-stack"
					target="_blank"
					rel="noopener noreferrer"
					className="flex flex-row items-center text-lg font-semibold text-[#8469e6] drop-shadow-sm 
          transition hover:scale-105 active:scale-100 dark:text-[#DCFF50]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						className="h-8 fill-[#8469e6] dark:fill-[#DCFF50]">
						<path
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
						/>
					</svg>
					<div className="w-2" />
					Check Github Documentation
				</a>
			</div>
			<div className="m-4" />

			{/* Brandings. */}
			<div className="flex max-w-6xl flex-wrap justify-center gap-8">
				{[
					{
						src: 'https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg',
						alt: 'Fly.io',
						href: 'https://fly.io',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg',
						alt: 'SQLite',
						href: 'https://sqlite.org',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg',
						alt: 'Prisma',
						href: 'https://prisma.io',
					},
					{
						src: 'https://avatars.githubusercontent.com/u/44036562?s=280&v=4',
						alt: 'Github Actions',
						href: 'https://github.com/features/actions',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg',
						alt: 'Cypress',
						href: 'https://www.cypress.io',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg',
						alt: 'MSW',
						href: 'https://mswjs.io',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg',
						alt: 'Vitest',
						href: 'https://vitest.dev',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png',
						alt: 'Testing Library',
						href: 'https://testing-library.com',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg',
						alt: 'Tailwind',
						href: 'https://tailwindcss.com',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg',
						alt: 'Prettier',
						href: 'https://prettier.io',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg',
						alt: 'ESLint',
						href: 'https://eslint.org',
					},
					{
						src: 'https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg',
						alt: 'TypeScript',
						href: 'https://typescriptlang.org',
					},
				].map((img) => (
					<a
						key={img.href}
						href={img.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-14 w-28 select-none justify-center p-1 opacity-80 drop-shadow-sm grayscale transition hover:scale-110
            hover:opacity-100 hover:grayscale-0 focus:grayscale-0 dark:-hue-rotate-180 dark:invert">
						<img alt={img.alt} src={img.src} />
					</a>
				))}
			</div>
		</div>
	)
}
