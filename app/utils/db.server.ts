import { PrismaClient } from '@prisma/client'
import { singleton } from '#app/utils/misc.server'

const prisma = singleton('prisma', () => new PrismaClient())
prisma.$connect()

export { prisma }
