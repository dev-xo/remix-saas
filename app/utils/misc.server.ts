/**
 * Utils
 */
export function safeRedirect(
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect = '/',
) {
	if (
		!to ||
		typeof to !== 'string' ||
		!to.startsWith('/') ||
		to.startsWith('//')
	) {
		return defaultRedirect
	}

	return to
}

export function getDomainUrl(request: Request) {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
	if (!host) throw new Error('Could not determine domain URL.')

	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}
