import { useFetcher } from '@remix-run/react'

export function CustomerPortalButton() {
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  return (
    <fetcher.Form method="post" action="/resources/stripe/create-customer-portal">
      <button
        className="flex h-10 w-48 flex-row items-center justify-center rounded-xl border border-gray-600 px-4 font-bold
        text-gray-200 transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
        <span>{isLoading ? 'Redirecting ...' : 'Customer Portal'}</span>
      </button>
    </fetcher.Form>
  )
}
