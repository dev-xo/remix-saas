/**
 * Remix Init.
 * @author @dev-xo https://github.com/dev-xo
 */
const { execSync } = require('child_process')
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const inquirer = require('inquirer')

const toml = require('@iarna/toml')
const YAML = require('yaml')
const semver = require('semver')
const PackageJson = require('@npmcli/package-json')

/**
 * Helpers.
 */
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const getRandomString = (length) => crypto.randomBytes(length).toString('hex')

/**
 * Returns the version of the package manager used in the workspace.
 */
const getPackageManagerVersion = (packageManager) =>
	execSync(`${packageManager} --version`).toString('utf-8').trim()

/**
 * Returns commands for the package manager used in the workspace.
 */
const getPackageManagerCommand = (packageManager) => {
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
 * Filters out unused dependencies.
 */
const removeUnusedDependencies = (dependencies, unusedDependencies) =>
	Object.fromEntries(
		Object.entries(dependencies).filter(
			([key]) => !unusedDependencies.includes(key),
		),
	)

/**
 * Cleans up Typescript references from Github workflows.
 */
const cleanupTypescriptWorkflow = async (rootDirectory) => {
	const DEPLOY_WORKFLOW_PATH = path.join(
		rootDirectory,
		'.github',
		'workflows',
		'deploy.yml',
	)

	const deployWorkflow = await fs.readFile(DEPLOY_WORKFLOW_PATH, 'utf-8')
	const parsedWorkflow = YAML.parse(deployWorkflow)

	delete parsedWorkflow.jobs.typecheck
	parsedWorkflow.jobs.deploy.needs = parsedWorkflow.jobs.deploy.needs.filter(
		(need) => need !== 'typecheck',
	)

	await fs.writeFile(DEPLOY_WORKFLOW_PATH, YAML.stringify(parsedWorkflow))
}

/**
 * Updates package.json.
 */
const updatePackageJson = async (rootDirectory, isTypeScript, APP_NAME) => {
	const packageJson = await PackageJson.load(rootDirectory)

	const {
		devDependencies,
		prisma: { seed: prismaSeed, ...prisma },
		scripts: { typecheck, validate, ...scripts },
	} = packageJson.content

	packageJson.update({
		name: APP_NAME,
		devDependencies: isTypeScript
			? devDependencies
			: removeUnusedDependencies(devDependencies, ['ts-node']),
		prisma: isTypeScript
			? { seed: prismaSeed, ...prisma }
			: {
					seed: prismaSeed
						.replace('ts-node', 'node')
						.replace('seed.ts', 'seed.js'),
					...prisma,
			  },
		scripts: isTypeScript
			? { ...scripts, typecheck, validate }
			: { ...scripts, validate: validate.replace(' typecheck', '') },
	})

	await packageJson.save()
}

/**
 * Creates a new `.env` file, based on `.env.example`.
 */
const initEnvFile = async (rootDirectory) => {
	const NEW_ENV_PATH = path.join(rootDirectory, '.env')
	const EXAMPLE_ENV_PATH = path.join(rootDirectory, '.env.example')

	const exampleEnv = await fs.readFile(EXAMPLE_ENV_PATH, 'utf-8')
	const newEnv = exampleEnv.replace(
		/^SESSION_SECRET=.*$/m,
		`SESSION_SECRET="${getRandomString(16)}"`,
	)
	await fs.writeFile(NEW_ENV_PATH, newEnv)

	// Removes `.env.example` file from directory.
	await fs.unlink(EXAMPLE_ENV_PATH)
}

/**
 * Replaces default project name for the one provided by `DIR_NAME`.
 */
const updateProjectNameFromRiles = async (rootDirectory, APP_NAME) => {
	// Paths.
	const FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')
	const README_PATH = path.join(rootDirectory, 'README.md')

	// Matches.
	const DEFAULT_PROJECT_NAME_MATCHER = /stripe-stack/gim

	const [flyToml, readme] = await Promise.all([
		fs.readFile(FLY_TOML_PATH, 'utf-8'),
		fs.readFile(README_PATH, 'utf-8'),
	])

	// Replaces Fly.toml file.
	const newFlyToml = toml.parse(flyToml)
	newFlyToml.app = newFlyToml.app.replace(
		DEFAULT_PROJECT_NAME_MATCHER,
		APP_NAME,
	)

	// Replaces README.md file.
	const newReadme = readme.replace(DEFAULT_PROJECT_NAME_MATCHER, APP_NAME)

	await Promise.all([
		fs.writeFile(FLY_TOML_PATH, toml.stringify(newFlyToml)),
		fs.writeFile(README_PATH, newReadme),
	])
}

/**
 * Updates `Dockerfile` based on the package manager used in the workspace.
 */
const replaceDockerLockFile = async (rootDirectory, pm) => {
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
 * Prepares environment for a PostgreSQL Deploy at Fly.io.
 * Based on inquirer.js.
 */
const initPostgresDeployEnvironment = async (rootDirectory) => {
	// Constants.
	const DEFAULT_DB = 'SQLite'
	const SQLITE_DB = 'SQLite'
	const POSTGRESQL_DB = 'PostgreSQL'

	// Paths.
	const PRISMA_SCHEMA_PATH = path.join(rootDirectory, 'prisma', 'schema.prisma')

	const SQLITE_DEPLOY_WORKFLOW_PATH = path.join(
		rootDirectory,
		'.github',
		'workflows',
		'deploy.yml',
	)
	const POSTGRES_DEPLOY_WORKFLOW_PATH = path.join(
		rootDirectory,
		'remix.init',
		'lib',
		'postgres',
		'deploy.yml',
	)

	const SQLITE_DOCKERFILE_PATH = path.join(rootDirectory, 'Dockerfile')
	const SQLITE_FLY_TOML_PATH = path.join(rootDirectory, 'fly.toml')

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

	const START_SH_PATH = path.join(rootDirectory, 'start.sh')

	// Matches & Replacers.
	const PRISMA_SQLITE_MATCHER = 'sqlite'
	const PRISMA_POSTGRES_REPLACER = 'postgresql'

	// Inquirer.
	await inquirer
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
				// Replaces Prisma scheme client provider.
				const prismaSchema = await fs.readFile(PRISMA_SCHEMA_PATH, 'utf-8')
				const newPrismaSchema = prismaSchema.replace(
					PRISMA_SQLITE_MATCHER,
					PRISMA_POSTGRES_REPLACER,
				)
				await fs.writeFile(PRISMA_SCHEMA_PATH, newPrismaSchema)

				// Replaces Github workflows.
				await fs.unlink(SQLITE_DEPLOY_WORKFLOW_PATH)
				await fs.rename(
					POSTGRES_DEPLOY_WORKFLOW_PATH,
					SQLITE_DEPLOY_WORKFLOW_PATH,
				)

				// Replaces deploy files.
				await fs.rename(POSTGRES_DOCKERFILE_PATH, SQLITE_DOCKERFILE_PATH)
				await fs.rename(POSTGRES_FLY_TOML_PATH, SQLITE_FLY_TOML_PATH)
				await fs.rename(
					POSTGRES_DOCKER_COMPOSE_YML_PATH,
					path.join(rootDirectory, 'docker-compose.yml'),
				)

				// Removes `start.sh`.
				await fs.unlink(START_SH_PATH)
			}
		})
		.catch((error) => {
			console.log(error)
		})
}

/**
 * Main function.
 * Runs after the project has been generated.
 */
const main = async ({ rootDirectory, packageManager, isTypeScript }) => {
	const DIR_NAME = path.basename(rootDirectory)
	const APP_NAME = DIR_NAME.replace(/[^a-zA-Z0-9-_]/g, '-')

	// Returns commands for the package manager used in the workspace.
	const pm = getPackageManagerCommand(packageManager)

	// Cleans up all Typescript references from the project.
	if (!isTypeScript)
		await Promise.all([cleanupTypescriptWorkflow(rootDirectory)])

	// Prepares environment for a PostgreSQL Deploy at Fly.io
	await initPostgresDeployEnvironment(rootDirectory)

	await Promise.all([
		// Updates package.json.
		updatePackageJson(rootDirectory, isTypeScript, APP_NAME),

		// Creates a new `.env` file, based on `.env.example`.
		initEnvFile(rootDirectory),

		// Replaces default project name for the one provided by `DIR_NAME`.
		updateProjectNameFromRiles(rootDirectory, APP_NAME),

		// Updates `Dockerfile` based on the package manager used in the workspace.
		replaceDockerLockFile(rootDirectory, pm),
	])

	// Formats the entire project.
	execSync(pm.run('format', '--loglevel warn'), {
		cwd: rootDirectory,
		stdio: 'inherit',
	})

	console.log(
		`
🥳 Template has been successfully initialized!.
🙏 Support us on Github if you found it useful.
 
📀 Start development with \`${pm.run('dev')}\`
 `.trim(),
	)
}

module.exports = main
