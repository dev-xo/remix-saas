/**
 * Using pnpm, `PrismaClient` has to be initialized.
 * Run `npx prisma generate` after a clean `pnpm install`.
 */
import { PrismaClient } from '@prisma/client'

/**
 * Inits Prisma Client.
 */
const prisma = new PrismaClient()

/**
 * Seeds Database.
 */
async function seed() {
	console.log(`Database has been successfully seeded with fresh air. 🌱`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
