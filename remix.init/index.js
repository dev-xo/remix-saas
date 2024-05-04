/**
 * Remix Init.
 * Implementation based on Remix's official templates.
 *
 * https://github.com/dev-xo
 */
const { execSync } = require('node:child_process')
const crypto = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')
const semver = require('semver')
const toml = require('@iarna/toml')
const PackageJson = require('@npmcli/package-json')

const DEFAULT_PROJECT_NAME_MATCHER = /remix-saas/gim

function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
}
function generateRandomHexadecimalString(length) {
  const hex = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += hex.charAt(Math.floor(Math.random() * hex.length))
  }
  return result
}

/**
 * Returns the version of the package manager used in the workspace.
 */
function getPackageManagerVersion(packageManager) {
  return execSync(`${packageManager} --version`).toString('utf-8').trim()
}

/**
 * Returns commands for the package manager used in workspace.
 */
function getPackageManagerCommand(packageManager) {
  return {
    npm: () => ({
      exec: 'npx',
      lockfile: 'package-lock.json',
      run: (script, args) => `npm run ${script} ${args ? `-- ${args}` : ''}`,
    }),
    pnpm: () => {
      const pnpmVersion = getPackageManagerVersion('pnpm')
      const includeDoubleDashBeforeArgs = semver.lt(pnpmVersion, '7.0.0')
      const useExec = semver.gte(pnpmVersion, '6.13.0')

      return {
        exec: useExec ? 'pnpm exec' : 'pnpx',
        lockfile: 'pnpm-lock.yaml',
        run: (script, args) =>
          includeDoubleDashBeforeArgs
            ? `pnpm run ${script} ${args ? `-- ${args}` : ''}`
            : `pnpm run ${script} ${args || ''}`,
      }
    },
    yarn: () => ({
      exec: 'yarn',
      lockfile: 'yarn.lock',
      run: (script, args) => `yarn ${script} ${args || ''}`,
    }),
  }[packageManager]()
}

/**
 * Updates package.json.
 */
async function updatePackageJson(rootDirectory, APP_NAME) {
  const packageJson = await PackageJson.load(rootDirectory)
  packageJson.update({ name: APP_NAME })
  await packageJson.save()
}

/**
 * Creates a new `.env` file, based on `.env.example`.
 * Also removes `.env.example`.
 */
async function initEnvFile(rootDirectory) {
  const NEW_ENV_PATH = path.join(rootDirectory, '.env')
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example')

  let newEnv = await fs.readFile(EXAMPLE_ENV_PATH, 'utf-8')
  newEnv = newEnv.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`,
  )
  newEnv = newEnv.replace(
    /^ENCRYPTION_SECRET=.*$/m,
    `ENCRYPTION_SECRET="${generateRandomHexadecimalString(64)}"`,
  )
  newEnv = newEnv.replace(
    /^HONEYPOT_ENCRYPTION_SEED=.*$/m,
    `HONEYPOT_ENCRYPTION_SEED="${generateRandomHexadecimalString(64)}"`,
  )

  await fs.writeFile(NEW_ENV_PATH, newEnv)
  await fs.unlink(EXAMPLE_ENV_PATH)
}

/**
 * Replaces default project name for the one provided by `DIR_NAME`.
 */
async function updateProjectNameFromRiles(rootDirectory, APP_NAME) {
  const FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')
  const [flyToml] = await Promise.all([fs.readFile(FLY_TOML_PATH, 'utf-8')])

  const newFlyToml = toml.parse(flyToml)
  newFlyToml.app = newFlyToml.app.replace(DEFAULT_PROJECT_NAME_MATCHER, APP_NAME)

  await Promise.all([fs.writeFile(FLY_TOML_PATH, toml.stringify(newFlyToml))])
}

async function removeUnusedFiles(rootDirectory) {
  const FILES_TO_REMOVE = ['CODE_OF_CONDUCT.md', 'LICENSE', 'SECURITY.md']

  await Promise.all(
    FILES_TO_REMOVE.map((file) => fs.unlink(path.join(rootDirectory, file))),
  )
}

/**
 * Main function.
 * Runs after the project has been generated.
 */
async function main({ rootDirectory, packageManager }) {
  const DIR_NAME = path.basename(rootDirectory)
  const APP_NAME = DIR_NAME.replace(/[^a-zA-Z0-9-_]/g, '-')

  const pm = getPackageManagerCommand(packageManager)

  try {
    await Promise.all([
      updatePackageJson(rootDirectory, APP_NAME),
      initEnvFile(rootDirectory),
      updateProjectNameFromRiles(rootDirectory, APP_NAME),
      removeUnusedFiles(rootDirectory),
    ])

    console.log('🎉 Template has been Successfully Initialized.')
    console.log('📚 Check Documentation: https://github.com/dev-xo/remix-saas')
    console.log('')
    console.log(`📀 Start Development server with \`${pm.run('dev')}\``.trim())
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = main
