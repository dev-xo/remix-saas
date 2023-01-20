import dayjs from 'dayjs'
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

export function formatUnixDate(unixDate: number) {
	// Extends DayJS module.
	dayjs.extend(LocalizedFormat)

	if (typeof unixDate === 'number') return dayjs.unix(unixDate).format('LLL')
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
