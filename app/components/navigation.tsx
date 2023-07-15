import type { User } from '@prisma/client'
import { Link, Form, useLocation } from '@remix-run/react'

type NavigationProps = {
  user: User | null
}

export function Navigation({ user }: NavigationProps) {
  const location = useLocation()

  return (
    <header
      className="z-10 m-auto my-0 flex max-h-[80px] min-h-[80px] 
			w-full flex-row items-center justify-between">
      {/* Left Menu. */}
      <Link
        to={!user ? '/' : '/account'}
        prefetch="intent"
        className="flex flex-row items-center text-xl font-light text-gray-400 transition hover:text-gray-100 active:opacity-80">
        <span className="font-bold text-gray-200">Stripe</span>&nbsp;Stack
        <div className="mx-1" />
        <small className="relative top-[2px] text-sm font-extrabold text-violet-200">
          v3.2
        </small>
      </Link>

      {/* Right Menu. */}
      <div className="flex flex-row items-center">
        <Link
          to="/plans"
          prefetch="intent"
          className="flex flex-row items-center text-sm font-semibold text-gray-400 
					transition hover:text-gray-100 active:text-violet-200">
          Plans
        </Link>
        <div className="mx-3 hidden sm:block" />

        <a
          href="https://github.com/dev-xo/stripe-stack"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden flex-row items-center text-sm font-semibold text-gray-400 
					transition hover:text-gray-100 active:text-violet-200 sm:flex">
          Docs
        </a>

        {!user &&
          location &&
          (location.pathname === '/' || location.pathname === '/plans') && (
            <>
              <div className="mx-3" />
              <Link
                to="/login"
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-gray-200 
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
                Log In
              </Link>
            </>
          )}

        {/* Log Out Form Button. */}
        {user && (
          <>
            <div className="mx-3" />
            <Form action="/auth/logout" method="post">
              <button
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-gray-200 
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
                Log Out
              </button>
            </Form>
          </>
        )}

        {/* Divider. */}
        <span className="mx-6 hidden h-5 w-px bg-gray-800 sm:block"></span>

        {/* Socials. */}
        <div className="hidden flex-row items-center sm:flex">
          <a
            href="https://github.com/dev-xo"
            target="_blank"
            rel="noopener noreferrer"
            className="">
            <svg
              className="6 h-6 w-6 fill-gray-400 transition hover:fill-gray-200 active:fill-violet-200"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
              />
            </svg>
          </a>
          <div className="mx-2" />

          <a
            href="https://twitter.com/DanielKanem"
            target="_blank"
            rel="noopener noreferrer"
            className="">
            <svg
              className="6 h-6 w-6 fill-gray-400 transition hover:fill-gray-200 active:fill-violet-200"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
