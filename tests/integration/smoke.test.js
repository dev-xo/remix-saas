import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'node:net'
import { once } from 'node:events'
import { parseSetCookie, stringifyCookie } from 'cookie'

import { it } from 'vitest'

it.runIf(process.env.RUN_APP_SMOKE === 'true')(
  'built app core flows',
  async () => {
    // Exercise the built app against an isolated database; no real accounts or APIs.
    const directory = await mkdtemp(join(tmpdir(), 'remix-saas-smoke-'))
    const socket = createServer().listen(0, '127.0.0.1')
    await once(socket, 'listening')
    const port = socket.address().port
    await new Promise((resolve) => socket.close(resolve))
    const env = {
      ...process.env,
      NODE_ENV: 'test',
      MOCK_SERVICES: 'true',
      PORT: String(port),
      DATABASE_URL: `file:${join(directory, 'test.db')}`,
      SESSION_SECRET: 'a'.repeat(64),
      ENCRYPTION_SECRET: 'b'.repeat(64),
      HONEYPOT_ENCRYPTION_SEED: 'c'.repeat(64),
      DEV_HOST_URL: `http://localhost:${port}`,
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
    }
    let server
    let log = ''
    const run = async (args) => {
      const child = spawn(process.execPath, args, {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      let output = ''
      child.stdout.on('data', (chunk) => {
        output += chunk
      })
      child.stderr.on('data', (chunk) => {
        output += chunk
      })
      const [code] = await once(child, 'exit')
      assert.equal(code, 0, output)
    }
    const waitFor = async (predicate) => {
      const deadline = Date.now() + 30_000
      while (!predicate()) {
        assert.ok(Date.now() < deadline, `Timed out.\n${log}`)
        if (server?.exitCode !== null && server?.exitCode !== undefined)
          throw new Error(log)
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }
    const client = () => {
      const cookies = {}
      return async (path, options = {}) => {
        const headers = new Headers(options.headers)
        headers.set('Cookie', stringifyCookie(cookies))
        headers.set('User-Agent', 'Mozilla/5.0')
        const response = await fetch(`http://localhost:${port}${path}`, {
          ...options,
          headers,
          redirect: 'manual',
        })
        for (const value of response.headers.getSetCookie()) {
          const cookie = parseSetCookie(value)
          cookies[cookie.name] = cookie.value
        }
        return response
      }
    }
    const decode = (value) =>
      value
        .replaceAll('&amp;', '&')
        .replaceAll('&quot;', '"')
        .replaceAll('&#x27;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
    const inputs = (html, field) => {
      const forms = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].map(
        (match) => match[1],
      )
      const form = forms.find((form) => form.includes(`name="${field}"`)) ?? forms[0]
      assert.ok(form, 'Expected a rendered form')
      const values = new URLSearchParams()
      for (const [tag] of form.matchAll(/<input\b[^>]*>/g)) {
        const attrs = Object.fromEntries(
          [...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [
            key,
            decode(value),
          ]),
        )
        if (attrs.name && attrs.type !== 'file') values.set(attrs.name, attrs.value ?? '')
      }
      return values
    }
    const post = (request, path, body) => request(path, { method: 'POST', body })
    const html = async (request, path, contains) => {
      const response = await request(path)
      assert.equal(response.status, 200, `${path}: ${await response.clone().text()}`)
      const text = await response.text()
      if (contains) assert.ok(text.includes(contains), `${path} missing ${contains}`)
      return text
    }

    try {
      await writeFile(join(directory, 'test.db'), '')
      await run(['node_modules/prisma/build/index.js', 'migrate', 'deploy'])
      await run(['--import=tsx', 'prisma/seed.ts'])
      // Seeding must be safe on repeated setup and must never call Stripe in mock mode.
      await run(['--import=tsx', 'prisma/seed.ts'])
      server = spawn(process.execPath, ['server.mjs'], {
        env,
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      server.stdout.on('data', (chunk) => {
        log += chunk
      })
      server.stderr.on('data', (chunk) => {
        log += chunk
      })
      await waitFor(() => log.includes('Express server listening'))
      const request = client()
      await html(request, '/', 'Remix SaaS')
      assert.equal((await request('/dashboard')).status, 302)
      assert.equal((await request('/auth/github', { method: 'POST' })).status, 404)
      assert.equal((await request('/api/webhook', { method: 'POST' })).status, 503)
      const login = await html(request, '/auth/login', 'Continue with Email')
      assert.ok(!login.includes('action="/auth/github"'))
      const invalid = new URLSearchParams({ email: 'smoke@example.com' })
      const invalidResponse = await post(request, '/auth/login', invalid)
      assert.equal(invalidResponse.status, 403, await invalidResponse.text())
      const form = inputs(login, 'email')
      form.set('email', 'smoke@example.com')
      assert.equal((await post(request, '/auth/login', form)).status, 302)
      await waitFor(() => log.includes('[Local auth] smoke@example.com'))
      const code = log.match(/smoke@example.com — Code: (\w+)/)?.[1]
      assert.ok(code, 'Expected a local email code in server output')
      let verify = inputs(await html(request, '/auth/verify', 'Check your inbox'), 'code')
      verify.set('code', 'INVALID')
      assert.equal((await post(request, '/auth/verify', verify)).status, 302)
      verify = inputs(await html(request, '/auth/verify'), 'code')
      verify.set('code', code)
      const verified = await post(request, '/auth/verify', verify)
      assert.equal(verified.headers.get('Location'), '/dashboard', `Login failed: ${log}`)
      assert.equal(
        (await request('/dashboard')).headers.get('Location'),
        '/onboarding/username',
      )
      const onboarding = inputs(
        await html(request, '/onboarding/username', 'Welcome!'),
        'username',
      )
      onboarding.set('username', 'smokeuser')
      assert.equal(
        (await post(request, '/onboarding/username', onboarding)).headers.get('Location'),
        '/dashboard',
      )
      await html(request, '/dashboard', 'Get Started')
      assert.equal((await request('/admin')).status, 403)
      const settings = await html(request, '/dashboard/settings', 'Your Avatar')
      const profile = inputs(settings, 'username')
      profile.set('username', 'smokerenamed')
      profile.set('INTENT', 'USER_UPDATE_USERNAME')
      assert.equal(
        (await post(request, '/dashboard/settings?index', profile)).status,
        200,
      )
      const upload = new FormData()
      upload.set(
        'imageFile',
        new File(
          [
            Buffer.from(
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aRZkAAAAASUVORK5CYII=',
              'base64',
            ),
          ],
          'avatar.png',
          { type: 'image/png' },
        ),
      )
      assert.equal((await post(request, '/resources/upload-image', upload)).status, 200)
      const withAvatar = await html(request, '/dashboard/settings', 'smokerenamed')
      const imagePath = withAvatar.match(/src="(\/resources\/user-images\/[^"?]+)/)?.[1]
      assert.ok(imagePath, 'Uploaded avatar must be rendered')
      const image = await request(imagePath)
      assert.equal(image.status, 200)
      assert.equal(image.headers.get('Content-Type'), 'image/png')
      assert.equal(
        (await post(request, '/resources/reset-image', new URLSearchParams())).status,
        200,
      )
      assert.equal((await request(imagePath)).status, 404)
      assert.equal(
        (
          await post(
            request,
            '/resources/update-theme',
            new URLSearchParams({ theme: 'dark' }),
          )
        ).status,
        200,
      )
      assert.ok((await html(request, '/dashboard')).includes('class="dark'))
      const billing = await html(request, '/dashboard/settings/billing', 'Free')
      const checkout = inputs(billing, 'planId')
      checkout.set('INTENT', 'SUBSCRIPTION_CREATE_CHECKOUT')
      checkout.set('planId', 'pro')
      checkout.set('planInterval', 'month')
      assert.equal(
        (await post(request, '/dashboard/settings/billing', checkout)).headers.get(
          'Location',
        ),
        '/dashboard/checkout',
      )
      await html(request, '/dashboard/checkout', 'Checkout completed!')
      await html(request, '/dashboard/settings/billing', 'Pro')
      assert.equal(
        (await post(request, '/auth/logout', new URLSearchParams())).status,
        302,
      )
      assert.equal((await request('/dashboard')).status, 302)

      const admin = client()
      const adminForm = inputs(await html(admin, '/auth/login'), 'email')
      adminForm.set('email', 'admin@admin.com')
      await post(admin, '/auth/login', adminForm)
      await waitFor(() => log.includes('[Local auth] admin@admin.com'))
      const magicLink = log.match(/admin@admin.com — Code: \w+ — Magic link: (\S+)/)?.[1]
      assert.ok(magicLink)
      const url = new URL(magicLink)
      assert.equal(
        (await admin(`${url.pathname}${url.search}`)).headers.get('Location'),
        '/dashboard',
      )
      await html(admin, '/admin', 'Customers')
      console.info(
        'Smoke passed: built server, migrations, repeatable seed, email code, magic link, onboarding, role checks, profile, avatar upload/reset, theme, local billing, logout.',
      )
    } catch (error) {
      console.error(log)
      throw error
    } finally {
      if (server && server.exitCode === null) {
        server.kill('SIGTERM')
        await once(server, 'exit')
      }
      await rm(directory, { recursive: true, force: true })
    }
  },
  120_000,
)
