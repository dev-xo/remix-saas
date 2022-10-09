import dayjs from 'dayjs'
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter'

/**
 * This should be used any time the redirect path is user-provided.
 * This avoids open-redirect vulnerabilities.
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

export const formatUnixDate = (unixDate: number) => {
	if (typeof unixDate === 'number')
		return dayjs.unix(unixDate).format('DD/MM/YYYY HH:mm')
}

export const hasDateExpired = (date: number) => {
	// Extends DayJS module.
	dayjs.extend(IsSameOrAfter)

	// Compares 'today' date with `date` parameter.
	// Returns a boolean.
	if (typeof date === 'number') {
		const dateToUnix = dayjs.unix(date)
		const hasExpired = dayjs().isSameOrAfter(dateToUnix, 'm')

		return hasExpired
	}
}
