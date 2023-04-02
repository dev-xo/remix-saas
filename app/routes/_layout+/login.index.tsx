import { Form, Link } from '@remix-run/react'

export default function LoginIndex() {
  return (
    <div className="flex w-full flex-col">
      {/* Google. */}
      <Form action={`/auth/google`} method="post">
        <button
          className="relative flex h-12 w-full flex-row items-center justify-center rounded-xl bg-[#4285f4] 
					text-base font-bold text-white transition hover:scale-105 hover:brightness-125 active:brightness-90">
          <svg
            className="absolute left-6 h-6 w-6 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
          </svg>

          <span>Continue with Google</span>
        </button>
      </Form>
      <div className="my-1" />

      {/* Email. */}
      <Link
        to="email"
        prefetch="intent"
        className="relative flex h-12 w-full flex-row items-center justify-center rounded-xl bg-violet-500 
				font-bold text-white transition hover:scale-105 hover:brightness-125 active:brightness-90">
        <svg
          className="absolute left-6 h-6 w-6 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
        </svg>

        <span>Continue with Email</span>
      </Link>
    </div>
  )
}
