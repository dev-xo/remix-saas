import { useFetcher } from '@remix-run/react'

export function CustomerPortalButton() {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	return (
		<fetcher.Form action="/resources/stripe/create-customer-portal" method="post">
			<button
				className="flex h-10 flex-row items-center justify-center rounded-xl bg-gray-500 px-6 
				font-bold text-gray-100 transition hover:scale-105 active:opacity-80">
				<span>{isLoading ? 'Redirecting ...' : 'Customer Portal'}</span>
			</button>
		</fetcher.Form>
	)
}
