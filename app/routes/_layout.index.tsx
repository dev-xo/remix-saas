import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

export async function loader() {
	// Fetches for Repository Stars.
	const repoResponse = await fetch(
		'http://api.github.com/repos/dev-xo/stripe-stack',
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	)
	const repoResponseToJson = await repoResponse.json()
	const repoStars = repoResponseToJson.stargazers_count || 120

	return json({ repoStars })
}

export default function Index() {
	const { repoStars } = useLoaderData<typeof loader>()

	return (
		<main className="mt-16 flex flex-col items-center justify-center">
			{/* Background Bloobs.. */}
			<div className="bloobs" />

			{/* Main. */}
			<div className="relative flex flex-col items-center">
				{/* Packages. */}
				<img
					src="https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg"
					alt=""
					className="float absolute top-[5%] left-[20%] h-16 w-28 select-none opacity-60 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
				/>
				<img
					src="https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg"
					alt=""
					className="float absolute top-[25%] left-[10%] h-16 w-28 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
				/>

				<img
					src="https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg"
					alt=""
					className="float absolute top-[5%] right-[20%] h-16 w-32 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
				/>
				<img
					src="https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg"
					alt=""
					className="float absolute top-[25%] right-[10%] h-14 w-14 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
				/>

				{/* Logo. */}
				<img
					src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/stripe.webp"
					alt=""
					className="pulse h-28 w-28 cursor-pointer select-none hue-rotate-15 transition hover:brightness-125"
				/>
				<div className="mb-8" />

				{/* Headings. */}
				<div className="flex flex-col items-center">
					<h1 className="text-4xl font-light text-gray-100">
						<span className="font-bold text-gray-100">Remix</span> Stacks
					</h1>
					<div className="mb-1" />
					<p className="cursor-default text-lg font-semibold text-gray-400 transition hover:brightness-125">
						Open Source Template
					</p>
				</div>
				<div className="mb-6" />

				<div className="flex cursor-default flex-col items-center">
					<h1 className="text-center text-8xl font-bold text-gray-100">
						<span
							className="bg-gradient-to-b from-violet-200 to-violet-500 
							bg-clip-text text-transparent transition hover:brightness-125">
							Stripe
						</span>{' '}
						Subscriptions
					</h1>
					<h1
						className="bg-gradient-to-b from-gray-200 to-gray-500 bg-clip-text text-8xl 
						font-bold text-transparent transition hover:brightness-125">
						made simpler
					</h1>
				</div>
				<div className="mb-6" />

				<p className="max-w-2xl text-center text-2xl font-semibold text-gray-400">
					Easily manage{' '}
					<a
						href="https://stripe.com/docs/billing/subscriptions/overview"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-100 underline decoration-gray-500 transition 
						hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
						Stripe Subscriptions
					</a>
					,{' '}
					<a
						href="https://stripe.com/docs/billing/subscriptions/integrating-customer-portal"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-100 underline decoration-gray-500 transition 
						hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
						Customer Portal
					</a>{' '}
					and{' '}
					<a
						href="https://github.com/sergiodxa/remix-auth"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-100 underline decoration-gray-500 transition 
						hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
						User Account
					</a>{' '}
					in the same template.
				</p>
				<div className="mb-8" />

				{/* Buttons. */}
				<div className="flex flex-row items-center">
					<a
						href="https://github.com/dev-xo/stripe-stack"
						target="_blank"
						rel="noopener noreferrer"
						className="flex h-14 flex-row items-center rounded-xl border border-gray-600 px-6 text-base font-bold text-gray-200 
						transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round">
							<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
							<path d="M9 18c-4.51 2-5-2-7-2" />
						</svg>
						<div className="mx-1" />
						GitHub Documentation
					</a>
					<div className="mx-2" />

					<Link
						to="/login"
						prefetch="intent"
						className="flex h-14 flex-row items-center rounded-xl bg-violet-500 px-6 text-base font-bold 
						text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
						Try Template
					</Link>
				</div>
			</div>
			<div className="m-4" />

			{/* Divider. */}
			<div className="relative flex flex-col items-center justify-center">
				{/* <svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="float absolute top-[20%] left-[10%] h-10 w-10 stroke-gray-100 opacity-20">
					<circle cx={18} cy={18} r={3} />
					<circle cx={6} cy={6} r={3} />
					<path d="M13 6h3a2 2 0 0 1 2 2v7" />
					<path d="M11 18H8a2 2 0 0 1-2-2V9" />
				</svg>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="float absolute bottom-[20%] right-[10%] h-10 w-10 stroke-gray-100 opacity-20">
					<circle cx={18} cy={18} r={3} />
					<circle cx={6} cy={6} r={3} />
					<path d="M18 6V5" />
					<path d="M18 11v-1" />
					<line x1={6} y1={9} x2={6} y2={21} />
				</svg> */}

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={0.4}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="h-60 w-60 rotate-90 stroke-gray-100 opacity-20">
					<circle cx={12} cy={12} r={3} />
					<line x1={3} y1={12} x2={9} y2={12} />
					<line x1={15} y1={12} x2={21} y2={12} />
				</svg>
			</div>
			<div className="m-2" />

			{/* Open Source. */}
			<div className="relative flex flex-col items-center justify-center">
				<h2 className="text-center text-6xl font-bold text-gray-100">
					Proudly Open Source
				</h2>
				<div className="m-3" />

				<p className="max-w-2xl text-center text-2xl font-semibold text-gray-400">
					Stripe Stack is open source and powered by open source software. The code
					is available on{' '}
					<a
						href="https://github.com/dev-xo/stripe-stack"
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-100 underline decoration-gray-500 transition 
						hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
						GitHub
					</a>
					.
				</p>
				<div className="m-6" />

				<div className="flex flex-row items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-12 w-12 stroke-violet-200 transition hover:brightness-105">
						<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
						<path d="M9 18c-4.51 2-5-2-7-2" />
					</svg>
					<div className="mx-1" />
					<p className="text-xl font-semibold text-gray-400">
						<span className="cursor-default font-bold text-violet-200 transition hover:brightness-125">
							{repoStars}
						</span>{' '}
						stars on{' '}
						<a
							href="https://github.com/dev-xo/stripe-stack"
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-100 underline decoration-gray-500 transition 
							hover:text-violet-200 hover:decoration-violet-200 active:opacity-80">
							GitHub
						</a>
					</p>
				</div>
			</div>
		</main>
	)
}
