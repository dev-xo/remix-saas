import type { User } from '@prisma/client'
import { faker } from '@faker-js/faker'

/**
 * Utils.
 */
export const createFakeEmailUser = (): Pick<
	User,
	'name' | 'email' | 'avatar'
> => {
	const firstName = faker.name.firstName()
	const lastName = faker.name.lastName()
	const username = faker.internet.userName(firstName, lastName).toLowerCase()

	return {
		name: `${firstName} ${lastName}`,
		email: `${username}@example.com`,
		avatar: `https://ui-avatars.com/api/?name=${firstName}`,
	}
}
