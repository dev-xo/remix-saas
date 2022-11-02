import { PrismaClient } from '@prisma/client'

let db: PrismaClient
declare global {
	var __db__: PrismaClient
}

/**
 * Utils
 * @required Template code.
 *
 * In development we don't want to restart the server with every change,
 * either create a new connection to the DB with every change.
 * In production we'll have a single connection to the DB.
 */
if (process.env.NODE_ENV === 'production') db = new PrismaClient()
else {
	if (!global.__db__) global.__db__ = new PrismaClient()
	db = global.__db__
	db.$connect()
}

export { db }
