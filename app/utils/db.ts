import { PrismaClient } from '@prisma/client'

let db: PrismaClient

declare global {
	var __db__: PrismaClient
}

if (process.env.NODE_ENV === 'production') {
	db = new PrismaClient()
} else {
	if (!global.__db__) global.__db__ = new PrismaClient()
	db = global.__db__
	db.$connect()
}

export { db }
