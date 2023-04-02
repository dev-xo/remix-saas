import dayjs from 'dayjs'
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

export function formatUnixDate(unixDate: number) {
  // Extend DayJS module.
  dayjs.extend(LocalizedFormat)

  if (typeof unixDate === 'number') return dayjs.unix(unixDate).format('LLL')
}

export function hasUnixDateExpired(date: number) {
  // Extend DayJS module.
  dayjs.extend(IsSameOrAfter)

  const unixDate = dayjs.unix(date)
  const hasExpired = dayjs().isSameOrAfter(unixDate, 'm')

  return hasExpired
}
