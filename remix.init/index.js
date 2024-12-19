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
const { confirm } = require('@inquirer/prompts')
const chalk = require('chalk')

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
 * Prompts user for Arcjet setup preferences.
 */
async function promptUser() {
  try {
    const optInArcjet = await confirm({
      message: chalk.blue('Would you like to use Arcjet Security?'),
      default: true,
    })
    return { optInArcjet }
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      console.log('\n👋 Setup cancelled. Exiting...')
      process.exit(0)
    }
    throw error
  }
}

/**
 * Updates package.json.
 */
async function updatePackageJson(rootDirectory, APP_NAME, useArcjet) {
  const packageJson = await PackageJson.load(rootDirectory)
  const updates = {
    name: APP_NAME,
  }

  if (useArcjet) {
    updates.dependencies = {
      ...packageJson.content.dependencies,
      '@arcjet/remix': '^1.0.0-alpha.34',
    }
  }

  packageJson.update(updates)
  await packageJson.save()
}

/**
 * Copies Arcjet implementation files.
 */
async function copyArcjetImplementation(rootDirectory) {
  const ARCJET_DIR = path.join(rootDirectory, 'arcjet')
  const arcjetFiles = [
    { from: 'app/root.tsx', to: 'app/root.tsx' },
    { from: 'app/routes/_home+/_index.tsx', to: 'app/routes/_home+/_index.tsx' },
    { from: 'app/routes/auth+/login.tsx', to: 'app/routes/auth+/login.tsx' },
    { from: 'app/utils/arcjet.server.ts', to: 'app/utils/arcjet.server.ts' },
    { from: 'app/utils/env.server.ts', to: 'app/utils/env.server.ts' },
  ]

  await Promise.all(
    arcjetFiles.map(async ({ from, to }) => {
      try {
        await fs.copyFile(path.join(ARCJET_DIR, from), path.join(rootDirectory, to))
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(
            chalk.yellow(`Warning: Source file ${from} not found in Arcjet directory.`),
          )
        } else {
          throw error
        }
      }
    }),
  )
}

/**
 * Creates a new `.env` file, based on `.env.example`.
 * Also removes `.env.example`.
 */
async function initEnvFile(rootDirectory, useArcjet) {
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

  if (useArcjet) {
    newEnv += `\n\n# Arcjet Security (Optional) - Rate limiting, bot detection, and request filtering.
# Get your free API key at https://arcjet.com and increase your app security.
ARCJET_KEY=""`
  }

  await fs.writeFile(NEW_ENV_PATH, newEnv)
  await fs.unlink(EXAMPLE_ENV_PATH)
}

/**
 * Prints welcome message with features list.
 */
function printWelcomeMessage() {
  const isDarkTheme = process.env.FORCE_COLOR !== '0' && process.env.TERM !== 'dumb'

  const colors = {
    title: isDarkTheme ? chalk.bold.magenta : chalk.bold.blue,
    version: isDarkTheme ? chalk.yellow : chalk.blue,
    header: isDarkTheme ? chalk.bold.cyan : chalk.bold.magenta,
    bullet: isDarkTheme ? chalk.gray : chalk.dim.black,
    feature: isDarkTheme ? chalk.cyan : chalk.blue,
    description: isDarkTheme ? chalk.gray : chalk.dim.black,
    separator: isDarkTheme ? chalk.dim : chalk.gray,
  }

  console.log('\n')
  console.log(colors.title('🛍️  Welcome to Remix SaaS!'))
  console.log(colors.version('✨ Version 3.0.0'))
  console.log('\n')
  console.log(colors.header('FEATURES'))

  const features = [
    ['Remix v3', 'Latest features.'],
    ['Stripe', 'Subscription management.'],
    ['Authentication', 'Passwordless and Social Logins.'],
    ['TailwindCSS & ShadCN', 'Beautiful Components and Easy Theming.'],
  ]

  features.forEach(([feature, desc]) => {
    console.log(
      `${colors.bullet('○')} ${colors.feature(feature)}${colors.description(
        ` - ${desc}`,
      )}`,
    )
  })

  console.log(
    `${colors.bullet('○')} ${colors.feature('React Email')}${colors.description(
      ', ',
    )}${colors.feature('I18N')}, ${colors.feature('File Uploads')}.
    `,
  )

  console.log(colors.description('...and much more!'))
  console.log('\n')
}

/**
 * Prints success message with next steps.
 */
function printSuccessMessage(optInArcjet, pm) {
  const isDarkTheme = process.env.FORCE_COLOR !== '0' && process.env.TERM !== 'dumb'

  const colors = {
    success: isDarkTheme ? chalk.bold.green : chalk.bold.green,
    header: isDarkTheme ? chalk.yellow : chalk.blue,
    subHeader: isDarkTheme ? chalk.cyan : chalk.magenta,
    bullet: isDarkTheme ? chalk.gray : chalk.dim.black,
    link: isDarkTheme ? chalk.blue.underline : chalk.magenta.underline,
    command: isDarkTheme ? chalk.cyan : chalk.blue,
    separator: isDarkTheme ? chalk.dim : chalk.gray,
    description: isDarkTheme ? chalk.gray : chalk.dim.black,
  }

  console.log('\n')

  if (optInArcjet) {
    console.log(colors.header('⚡ Next Steps:'))
    console.log(colors.subHeader('📚 Arcjet Security Setup:'))
    console.log(
      `${colors.bullet('1.')} Visit your Dashboard: ${colors.link('https://arcjet.com')}`,
    )
    console.log(`${colors.bullet('2.')} Update the .env file with your Arcjet API key.`)
    console.log(
      `${colors.bullet('3.')} Start development server: ${colors.command(pm.run('dev'))}`,
    )
  } else {
    console.log(colors.header('⚡ Getting Started:'))
    console.log(
      `${colors.bullet('1.')} Install dependencies: ${colors.command('npm install')}`,
    )
    console.log(
      `${colors.bullet('2.')} Start development server: ${colors.command(pm.run('dev'))}`,
    )
  }

  console.log(`\nOpen ${colors.link('http://localhost:3000')} in your browser.`)

  console.log('\n')
  console.log(colors.success('You are all set!\n'))
  console.log(colors.subHeader('💛 Support Remix SaaS with a Coffee.'))
  console.log(
    `${colors.bullet('🌱')} ${colors.link('https://github.com/dev-xo/remix-saas')}`,
  )
}

/**
 * Main function.
 */
async function main({ rootDirectory, packageManager }) {
  const DIR_NAME = path.basename(rootDirectory)
  const APP_NAME = DIR_NAME.replace(/[^a-zA-Z0-9-_]/g, '-')
  const pm = getPackageManagerCommand(packageManager)

  try {
    printWelcomeMessage()

    const { optInArcjet } = await promptUser()

    await Promise.all([
      updatePackageJson(rootDirectory, APP_NAME, optInArcjet),
      initEnvFile(rootDirectory, optInArcjet),
      updateProjectNameFromRiles(rootDirectory, APP_NAME),
      removeUnusedFiles(rootDirectory),
    ])

    if (optInArcjet) {
      await copyArcjetImplementation(rootDirectory)
    }

    printSuccessMessage(optInArcjet, pm)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = main
