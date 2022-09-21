import { useFetcher } from '@remix-run/react'

export const CreateCustomerPortalButton = () => {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	return (
		<fetcher.Form
			action="/resources/stripe/create-customer-portal"
			method="post">
			<button
				className="flex h-9 flex-row items-center justify-center rounded-xl
				bg-slate-700 px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100">
				<span>{isLoading ? 'Redirecting ...' : 'Customer Portal'}</span>
			</button>
		</fetcher.Form>
	)
}
