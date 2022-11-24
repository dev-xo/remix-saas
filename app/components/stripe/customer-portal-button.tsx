import { useFetcher } from '@remix-run/react'

export const CustomerPortalButton = () => {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	return (
		<fetcher.Form action="/stripe/create-customer-portal" method="post">
			<button
				className="flex h-9 flex-row items-center justify-center rounded-xl
				bg-gray-500 px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100">
				<span>{isLoading ? 'Redirecting ...' : 'Customer Portal'}</span>
			</button>
		</fetcher.Form>
	)
}
