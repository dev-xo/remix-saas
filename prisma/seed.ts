import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
	console.log(`Database has been successfully seeded. 🌱`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
