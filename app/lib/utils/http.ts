export function getDomainUrl(request: Request) {
	const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')
	if (!host) throw new Error('Could not determine URL host.')

	const protocol = host.includes('localhost') ? 'http' : 'https'
	return `${protocol}://${host}`
}

export function getDomainPathname(request: Request) {
	const pathname = new URL(request.url).pathname
	if (!pathname) throw new Error('Could not determine URL pathname.')

	return pathname
}
