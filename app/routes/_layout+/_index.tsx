import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [
  { title: 'Stripe Stack - Remix' },
  {
    description: `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    keywords:
      'remix, stripe, remix-stack, typescript, sqlite, postgresql, prisma, tailwindcss, fly.io',
  },
  { 'og:title': 'Stripe Stack - Remix' },
  { 'og:type': 'website' },
  { 'og:url': 'https://stripe-stack.fly.dev' },
  {
    'og:image':
      'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
  },
  { 'og:card': 'summary_large_image' },
  { 'og:creator': '@DanielKanem' },
  { 'og:site': 'https://stripe-stack.fly.dev' },
  {
    'og:description': `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    'twitter:image':
      'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
  },
  { 'twitter:card': 'summary_large_image' },
  { 'twitter:creator': '@DanielKanem' },
  { 'twitter:title': 'Stripe Stack - Remix' },
  {
    'twitter:description': `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
]

export default function Index() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      {/* Main. */}
      <div className="relative flex flex-col items-center">
        {/* Packages. */}
        <img
          src="https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg"
          alt=""
          className="float absolute left-[25%] top-[5%] h-16 w-28 select-none opacity-60 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
        />
        <img
          src="https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg"
          alt=""
          className="float absolute left-[15%] top-[25%] h-16 w-28 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
        />

        <img
          src="https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg"
          alt=""
          className="float absolute right-[25%] top-[5%] h-16 w-32 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
        />
        <img
          src="https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg"
          alt=""
          className="float absolute right-[15%] top-[25%] h-14 w-14 select-none opacity-80 grayscale hue-rotate-180 invert transition
					hover:scale-110 hover:opacity-100 hover:grayscale-0"
        />

        {/* Logo. */}
        <img
          src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/stripe.webp"
          alt=""
          className="pulse h-24 w-24 cursor-pointer select-none hue-rotate-15 transition hover:brightness-125"
        />
        <div className="my-4" />

        {/* Headings. */}
        <div className="z-20 flex flex-col items-center">
          <h1 className="text-3xl font-light text-gray-100">
            <span className="font-bold text-gray-100">Remix</span> Stacks
          </h1>
          <p className="cursor-default text-lg font-semibold text-gray-400 transition hover:brightness-125">
            Open Source Template
          </p>
        </div>
        <div className="my-3" />

        <div className="flex cursor-default flex-col items-center">
          <h1 className="text-center text-8xl font-bold text-gray-200">
            <span
              className="bg-gradient-to-b from-violet-200 to-violet-500 
							bg-clip-text text-transparent transition hover:brightness-125">
              Stripe
            </span>{' '}
            Subscriptions
          </h1>
          <h1
            className="bg-gradient-to-b from-gray-200 to-gray-400 bg-clip-text text-8xl 
						font-bold text-transparent transition hover:brightness-125">
            made simpler
          </h1>
        </div>
        <div className="my-4" />

        <p className="max-w-lg text-center text-base font-semibold text-gray-400 sm:text-xl">
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
        <div className="my-3" />

        {/* Buttons. */}
        <div className="flex flex-row items-center">
          <a
            href="https://github.com/dev-xo/stripe-stack"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-12 flex-row items-center rounded-xl border border-gray-600 px-6 font-bold 
						text-gray-200 transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80 sm:flex">
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
            className="flex h-12 flex-row items-center rounded-xl bg-violet-500 px-6 font-bold 
						text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
            Try Template
          </Link>
        </div>
      </div>
    </main>
  )
}
