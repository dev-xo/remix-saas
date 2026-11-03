import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initEnvs, isMockServices } from '#app/utils/env.server'

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('MOCK_SERVICES', 'true')
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(64))
  vi.stubEnv('ENCRYPTION_SECRET', 'b'.repeat(64))
  vi.stubEnv('HONEYPOT_ENCRYPTION_SEED', 'c'.repeat(64))
  vi.stubEnv('DATABASE_URL', 'file:./test.db')
})
const temporaryDirectories: string[] = []
const { initEnvFile } = createRequire(import.meta.url)('../../remix.init/index.js') as {
  initEnvFile: (rootDirectory: string) => Promise<string>
}

afterEach(async () => {
  vi.unstubAllEnvs()
  await Promise.all(
    temporaryDirectories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  )
})

describe('environment boundaries', () => {
  it('allows credential-free local development', () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    expect(() => initEnvs()).not.toThrow()
    expect(isMockServices()).toBe(true)
  })
  it('rejects mocks in production', () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PROD_HOST_URL', 'https://example.com')
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => initEnvs()).toThrow('Invalid environment')
    expect(() => isMockServices()).toThrow('restricted')
    log.mockRestore()
  })
  it('requires credentials when mocks are disabled', () => {
    vi.stubEnv('MOCK_SERVICES', 'false')
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => initEnvs()).toThrow('Invalid environment')
    log.mockRestore()
  })
})

it('generates independent cryptographic secrets and retains the env example', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'remix-saas-env-'))
  temporaryDirectories.push(directory)
  const example = await readFile(new URL('../../.env.example', import.meta.url), 'utf8')
  await writeFile(join(directory, '.env.example'), example)
  const envPath = await initEnvFile(directory)
  const env = await readFile(envPath, 'utf8')
  const secrets = [
    ...env.matchAll(
      /^(?:SESSION_SECRET|ENCRYPTION_SECRET|HONEYPOT_ENCRYPTION_SEED)="([a-f0-9]{64})"$/gm,
    ),
  ]
  expect(secrets).toHaveLength(3)
  expect(new Set(secrets.map((match) => match[1])).size).toBe(3)
  expect(await readFile(join(directory, '.env.example'), 'utf8')).toBe(example)
})

it('preserves an existing environment on repeat setup', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'remix-saas-env-'))
  temporaryDirectories.push(directory)
  const contents = 'SESSION_SECRET="existing-secret"\n'
  await writeFile(join(directory, '.env'), contents)
  await initEnvFile(directory)
  expect(await readFile(join(directory, '.env'), 'utf8')).toBe(contents)
})
