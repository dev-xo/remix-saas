import dayjs from 'dayjs'
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter'

/**
 * Remix Utils.
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

/**
 * Date Utils.
 */
export function formatUnixDate(unixDate: number) {
	if (typeof unixDate === 'number')
		return dayjs.unix(unixDate).format('DD/MM/YYYY HH:mm')
}

export function hasDateExpired(date: number) {
	// Extends DayJS module.
	dayjs.extend(IsSameOrAfter)

	// Compares 'today' date with `date` parameter.
	if (typeof date === 'number') {
		const dateToUnix = dayjs.unix(date)
		const hasExpired = dayjs().isSameOrAfter(dateToUnix, 'm')

		return hasExpired
	}
}

/**
 * Global Envs Utils.
 */
export function getGlobalEnvs() {
	return {
		PLAN_1_PRICE_ID: process.env.PLAN_1_PRICE_ID,
		PLAN_2_PRICE_ID: process.env.PLAN_2_PRICE_ID,
		PLAN_3_PRICE_ID: process.env.PLAN_3_PRICE_ID,
	}
}
