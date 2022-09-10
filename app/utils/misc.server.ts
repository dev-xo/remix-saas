/**
 * This should be used any time the redirect path is user-provided.
 * This avoids open-redirect vulnerabilities.
 *
 * @param { string } to Redirect destination.
 * @param { string } defaultRedirect Default redirect if `to` is unsafe.
 */
export const safeRedirect = (
	to: FormDataEntryValue | string | null | undefined,
	defaultRedirect = '/',
) => {
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

export const getDomainUrl = (request: Request) => {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
	if (!host) throw new Error('Could not determine domain URL.')

	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}
