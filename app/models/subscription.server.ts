import type { Subscription } from '@prisma/client';
import { db } from '~/utils/db.server';

/**
 * Mutations.
 */
export const createSubscription = async (
	subscription: Omit<Subscription, 'id'>,
) => {
	return db.subscription.create({ data: subscription });
};

export const updateSubscription = async (
	customerId: Subscription['customerId'],
	subscription: Partial<Subscription>,
) => {
	if (typeof customerId !== 'string')
		throw new Error('Typeof customerId should be a string.');

	return db.subscription.update({
		where: { customerId },
		data: { ...subscription },
	});
};

/**
 * Queries.
 */
export const getSubscriptionByCustomerId = async (
	customerId: Subscription['customerId'],
) => {
	if (typeof customerId !== 'string')
		throw new Error('Typeof customerId should be a string.');

	return db.subscription.findUnique({ where: { customerId } });
};
