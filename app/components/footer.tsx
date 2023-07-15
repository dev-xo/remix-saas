import { Link, useLocation } from '@remix-run/react'

export function Footer() {
  const location = useLocation()

  return location.pathname !== '/support' ? (
    <footer
      className="z-10 m-auto my-0 flex max-h-[64px] min-h-[64px] 
      w-full flex-row items-center justify-center">
      <p className="flex flex-row items-center text-sm font-semibold text-gray-400">
        Created by{' '}
        <a
          href="https://twitter.com/DanielKanem"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row items-center text-gray-100 underline decoration-gray-500 transition
          hover:scale-105 hover:text-violet-200 hover:decoration-violet-200 hover:brightness-125 active:opacity-80">
          <img
            src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/profile-avatar.png"
            alt=""
            className="mx-2 max-h-6 select-none rounded-full brightness-110"
          />
          @DanielKanem
        </a>
      </p>
      {/* Divider. */}
      <span className="mx-6 h-5 w-px bg-gray-800"></span>
      <Link
        to="/support"
        className="flex flex-row items-center text-sm font-semibold text-gray-400 hover:text-gray-200">
        <svg
          className="h-5 w-5 fill-violet-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z" />
        </svg>
        <div className="mx-1" />
        Support
      </Link>
    </footer>
  ) : (
    <footer className="z-10 m-auto my-0 flex max-h-[64px] min-h-[64px] w-full flex-row items-center justify-center">
      <p className="flex flex-row items-center text-sm font-semibold text-gray-400 hover:text-gray-200">
        <svg
          className="h-5 w-5 fill-green-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z" />
        </svg>
        <div className="mx-1" />
        Thank you!
      </p>
    </footer>
  )
}
