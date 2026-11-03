/**
 * Remix Init.
 * Implementation based on Remix's official templates.
 *
 * https://github.com/dev-xo
 */
const crypto = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')
let toml, PackageJson, chalk

const DEFAULT_PROJECT_NAME_MATCHER = /remix-saas/gim

function getPackageManagerCommand(packageManager) {
  if (!['npm', 'pnpm', 'yarn'].includes(packageManager))
    throw new Error('Unsupported package manager.')
  return { run: (script) => `${packageManager} run ${script}` }
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
 * Updates package.json.
 */
async function updatePackageJson(rootDirectory, APP_NAME) {
  const packageJson = await PackageJson.load(rootDirectory)
  const updates = {
    name: APP_NAME,
  }

  packageJson.update(updates)
  await packageJson.save()
}

/** Create the environment once; preserve existing credentials and the example. */
async function initEnvFile(rootDirectory) {
  const envPath = path.join(rootDirectory, '.env')
  try {
    await fs.readFile(envPath)
    console.info('Keeping existing .env')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    let env = await fs.readFile(path.join(rootDirectory, '.env.example'), 'utf8')
    for (const key of [
      'SESSION_SECRET',
      'ENCRYPTION_SECRET',
      'HONEYPOT_ENCRYPTION_SEED',
    ]) {
      env = env.replace(
        new RegExp(`^${key}=.*$`, 'm'),
        `${key}="${crypto.randomBytes(32).toString('hex')}"`,
      )
    }
    await fs.writeFile(envPath, env, { flag: 'wx', mode: 0o600 })
    console.info('Created local .env with random secrets and mocked services')
  }
  return envPath
}

async function setupEnvironment(rootDirectory) {
  if (process.env.NODE_ENV === 'production')
    throw new Error('Use migrations to set up a production database.')
  process.loadEnvFile(await initEnvFile(rootDirectory))
  if (process.env.NODE_ENV === 'production')
    throw new Error('Use migrations to set up a production database.')
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl?.startsWith('file:'))
    throw new Error('Local setup requires a SQLite DATABASE_URL.')
  const databasePath = path.resolve(
    rootDirectory,
    'prisma',
    databaseUrl.slice(5).split('?')[0],
  )
  await fs.mkdir(path.dirname(databasePath), { recursive: true })
  await (await fs.open(databasePath, 'a')).close()
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
    ['Remix v2', 'Latest compatible release.'],
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
function printSuccessMessage(pm) {
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

  console.log(colors.header('⚡ Getting Started:'))
  console.log(
    `${colors.bullet('1.')} Install dependencies: ${colors.command('npm install')}`,
  )
  console.log(
    `${colors.bullet('2.')} Initialize the local database: ${colors.command(pm.run('setup'))}`,
  )
  console.log(
    `${colors.bullet('3.')} Start development server: ${colors.command(pm.run('dev'))}`,
  )

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
    // Template-only dependencies are not needed by local environment setup.
    toml = require('@iarna/toml')
    PackageJson = require('@npmcli/package-json')
    chalk = require('chalk')
    printWelcomeMessage()

    await Promise.all([
      updatePackageJson(rootDirectory, APP_NAME),
      initEnvFile(rootDirectory),
      updateProjectNameFromRiles(rootDirectory, APP_NAME),
      removeUnusedFiles(rootDirectory),
    ])

    printSuccessMessage(pm)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = main

module.exports.initEnvFile = initEnvFile

if (require.main === module) {
  if (process.argv[2] !== '--env-only') throw new Error('Use --env-only for local setup.')
  setupEnvironment(process.cwd()).catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
