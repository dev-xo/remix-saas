import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { singleton } from '#app/utils/misc.server'

// Preserve Prisma's existing convention: relative SQLite paths are relative to
// prisma/schema.prisma. Absolute file URLs work in deployed environments too.
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl?.startsWith('file:'))
  throw new Error('A SQLite DATABASE_URL is required.')
const filePath = databaseUrl.slice('file:'.length).split('?')[0]
const url = `file:${resolve('prisma', filePath)}`
const prisma = singleton(
  'prisma',
  () => new PrismaClient({ adapter: new PrismaLibSql({ url }) }),
)

export { prisma }
