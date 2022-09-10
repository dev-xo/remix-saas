/**
 * Utils.
 * @protected Template code.
 */
import type { Subscription } from '@prisma/client'
import dayjs from 'dayjs'

export const formatExpirationDate = (
	currentPeriodEnd: Subscription['currentPeriodEnd'],
) => {
	if (typeof currentPeriodEnd === 'number')
		return dayjs.unix(currentPeriodEnd).format('DD/MM/YYYY HH:mm')

	return null
}
