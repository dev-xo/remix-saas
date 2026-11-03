import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { defineConfig, env } from 'prisma/config'

if (existsSync('.env')) process.loadEnvFile('.env')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations', seed: 'node --import=tsx prisma/seed.ts' },
  datasource: {
    url: `file:${resolve('prisma', env('DATABASE_URL').slice(5).split('?')[0])}`,
  },
})
