/**
 * Utils.
 * @protected Template code.
 *
 * Returns a Boolean based on Subscription expiration.
 */
import type { Subscription } from '@prisma/client'
import dayjs from 'dayjs'
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter'

export const hasExpired = (
	currentPeriodEnd: Subscription['currentPeriodEnd'],
) => {
	/**
	 * Extends DayJS module.
	 */
	dayjs.extend(IsSameOrAfter)

	if (typeof currentPeriodEnd === 'number') {
		/**
		 * Compares today date with `currentPeriodEnd`.
		 */
		const formatedCurrentPeriodEnd = dayjs.unix(currentPeriodEnd)
		const hasSubscriptionExpired = dayjs().isSameOrAfter(
			formatedCurrentPeriodEnd,
			'm',
		)

		return hasSubscriptionExpired
	}
}
