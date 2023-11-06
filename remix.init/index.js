/**
 * Remix Init.
 * @author https://github.com/dev-xo
 */
const { execSync } = require('node:child_process')
const crypto = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')

const toml = require('@iarna/toml')
const PackageJson = require('@npmcli/package-json')
const inquirer = require('inquirer')
const rimraf = require('rimraf')
const semver = require('semver')

/**
 * Constants.
 */
const DEFAULT_DB = 'SQLite'
const SQLITE_DB = 'SQLite'
const POSTGRESQL_DB = 'PostgreSQL'
const DEFAULT_PROJECT_NAME_MATCHER = /stripe-stack-dev/gim

/**
 * Helpers.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
function getRandomString(length) {
  return crypto.randomBytes(length).toString('hex')
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

  packageJson.update({
    name: APP_NAME,
  })

  await packageJson.save()
}

/**
 * Creates a new `.env` file, based on `.env.example`.
 * Also removes `.env.example`.
 */
async function initEnvFile(rootDirectory) {
  const NEW_ENV_PATH = path.join(rootDirectory, '.env')
  const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example')

  const exampleEnv = await fs.readFile(EXAMPLE_ENV_PATH, 'utf-8')
  const newEnv = exampleEnv.replace(
    /^SESSION_SECRET=.*$/m,
    `SESSION_SECRET="${getRandomString(16)}"`,
  )
  await fs.writeFile(NEW_ENV_PATH, newEnv)
  await fs.unlink(EXAMPLE_ENV_PATH)
}

/**
 * Replaces default project name for the one provided by `DIR_NAME`.
 */
async function updateProjectNameFromRiles(rootDirectory, APP_NAME) {
  // Paths.
  const FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')
  const README_PATH = path.join(rootDirectory, 'README.md')

  const [flyToml, readme] = await Promise.all([
    fs.readFile(FLY_TOML_PATH, 'utf-8'),
    fs.readFile(README_PATH, 'utf-8'),
  ])

  // Replaces Fly.toml file.
  const newFlyToml = toml.parse(flyToml)
  newFlyToml.app = newFlyToml.app.replace(DEFAULT_PROJECT_NAME_MATCHER, APP_NAME)

  // Replaces README.md file.
  const newReadme = readme.replace(DEFAULT_PROJECT_NAME_MATCHER, APP_NAME)

  await Promise.all([
    fs.writeFile(FLY_TOML_PATH, toml.stringify(newFlyToml)),
    fs.writeFile(README_PATH, newReadme),
  ])
}

/**
 * Updates `Dockerfile` based on the package manager used in workspace.
 */
async function replaceDockerLockFile(rootDirectory, pm) {
  const DOCKERFILE_PATH = path.join(rootDirectory, 'Dockerfile')

  const dockerfile = await fs.readFile(DOCKERFILE_PATH, 'utf-8')
  const newDockerfile = pm.lockfile
    ? dockerfile.replace(
        new RegExp(escapeRegExp('ADD package.json'), 'g'),
        `ADD package.json ${pm.lockfile}`,
      )
    : dockerfile
  await fs.writeFile(DOCKERFILE_PATH, newDockerfile)
}

/**
 * Prepares environment for deployment at Fly.io.
 */
async function initDeployEnvironment(rootDirectory) {
  // Prisma Paths.
  const PRISMA_SCHEMA_PATH = path.join(rootDirectory, 'prisma', 'schema.prisma')
  const PRISMA_MIGRATIONS_PATH = path.join(rootDirectory, 'prisma', 'migrations')
  const PRISMA_DEV_DB_PATH = path.join(rootDirectory, 'prisma', 'dev.db')
  const PRISMA_DEV_DB_JOURNAL_PATH = path.join(rootDirectory, 'prisma', 'dev.db-journal')

  // Github Workflows Paths.
  const DEPLOY_WORKFLOW_PATH = path.join(
    rootDirectory,
    '.github',
    'workflows',
    'deploy.yml',
  )

  // Matches & Replacers.
  const PRISMA_SQLITE_MATCHER = 'sqlite'
  const PRISMA_POSTGRES_REPLACER = 'postgresql'

  // Cleaning prisma folder files for SQLite and Postgres.
  rimraf.sync(PRISMA_MIGRATIONS_PATH, {}, () => true)
  rimraf.sync(PRISMA_DEV_DB_PATH, {}, () => true)
  rimraf.sync(PRISMA_DEV_DB_JOURNAL_PATH, {}, () => true)

  // Inits Inquirer.
  const dbChoice = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'database',
        message: 'What database will your project run on?',
        default: DEFAULT_DB,
        choices: [SQLITE_DB, POSTGRESQL_DB],
      },
    ])
    .then(async (answers) => {
      const dbAnswer = answers.database

      if (dbAnswer === POSTGRESQL_DB) {
        // Paths.
        const POSTGRES_DEPLOY_WORKFLOW_PATH = path.join(
          rootDirectory,
          'remix.init',
          'lib',
          'postgres',
          'deploy.yml',
        )
        const POSTGRES_DOCKERFILE_PATH = path.join(
          rootDirectory,
          'remix.init',
          'lib',
          'postgres',
          'Dockerfile',
        )
        const POSTGRES_FLY_TOML_PATH = path.join(
          rootDirectory,
          'remix.init',
          'lib',
          'postgres',
          'fly.toml',
        )
        const POSTGRES_DOCKER_COMPOSE_YML_PATH = path.join(
          rootDirectory,
          'remix.init',
          'lib',
          'postgres',
          'docker-compose.yml',
        )
        const POSTGRES_ENV_EXAMPLE_PATH = path.join(
          rootDirectory,
          'remix.init',
          'lib',
          'postgres',
          '.env.example',
        )

        // Replaces Prisma files.
        const prismaSchema = await fs.readFile(PRISMA_SCHEMA_PATH, 'utf-8')
        const newPrismaSchema = prismaSchema.replace(
          PRISMA_SQLITE_MATCHER,
          PRISMA_POSTGRES_REPLACER,
        )
        await fs.writeFile(PRISMA_SCHEMA_PATH, newPrismaSchema)

        // Replaces GitHub workflows.
        await fs.unlink(DEPLOY_WORKFLOW_PATH)
        await fs.rename(POSTGRES_DEPLOY_WORKFLOW_PATH, DEPLOY_WORKFLOW_PATH)

        // Replaces deploy files.
        await fs.rename(POSTGRES_DOCKERFILE_PATH, path.join(rootDirectory, 'Dockerfile'))
        await fs.rename(POSTGRES_FLY_TOML_PATH, path.join(rootDirectory, 'fly.toml'))
        await fs.rename(
          POSTGRES_DOCKER_COMPOSE_YML_PATH,
          path.join(rootDirectory, 'docker-compose.yml'),
        )

        // Replaces .env.example file.
        await fs.rename(
          POSTGRES_ENV_EXAMPLE_PATH,
          path.join(rootDirectory, '.env.example'),
        )
      }

      return dbAnswer
    })
    .catch((err) => {
      console.log(err)
    })

  return dbChoice
}

/**
 * Main function.
 * Runs after the project has been generated.
 */
async function main({ rootDirectory, packageManager }) {
  const DIR_NAME = path.basename(rootDirectory)
  const APP_NAME = DIR_NAME.replace(/[^a-zA-Z0-9-_]/g, '-')

  // Returns commands for the package manager used in workspace.
  const pm = getPackageManagerCommand(packageManager)

  // Prepares environment for deployment at Fly.io.
  await initDeployEnvironment(rootDirectory)

  await Promise.all([
    // Updates package.json.
    updatePackageJson(rootDirectory, APP_NAME),

    // Creates a new `.env` file, based on `.env.example`.
    initEnvFile(rootDirectory),

    // Replaces default project name for the one provided by `DIR_NAME`.
    updateProjectNameFromRiles(rootDirectory, APP_NAME),

    // Updates `Dockerfile` based on the package manager used in workspace.
    replaceDockerLockFile(rootDirectory, pm),
  ])

  console.log('🎉 Template has been successfully initialized.')
  console.log('📚 Check documentation to successfully initialize your database.')
  console.log('')
  console.log(`📀 Start development server with \`${pm.run('dev')}\``.trim())
}

module.exports = main
