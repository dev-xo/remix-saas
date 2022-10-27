import dayjs from 'dayjs';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';

export const formatUnixDate = (unixDate: number) => {
	if (typeof unixDate === 'number')
		return dayjs.unix(unixDate).format('DD/MM/YYYY HH:mm');
};

export const hasDateExpired = (date: number) => {
	// Extends DayJS module.
	dayjs.extend(IsSameOrAfter);

	// Compares 'today' date with `date` parameter.
	// Returns a boolean.
	if (typeof date === 'number') {
		const dateToUnix = dayjs.unix(date);
		const hasExpired = dayjs().isSameOrAfter(dateToUnix, 'm');

		return hasExpired;
	}
};
