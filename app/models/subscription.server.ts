import type { Subscription } from '@prisma/client';
import { db } from '~/utils/db.server';

/**
 * Mutations.
 * @required Template code.
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
	if (typeof customerId === 'string')
		return db.subscription.update({
			where: { customerId },
			data: { ...subscription },
		});
};

/**
 * Queries.
 * @required Template code.
 */
export const getSubscriptionByCustomerId = async (
	customerId: Subscription['customerId'],
) => {
	if (typeof customerId === 'string')
		return db.subscription.findUnique({ where: { customerId } });
};
