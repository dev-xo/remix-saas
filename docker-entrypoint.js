#!/usr/bin/env node

import { spawn } from 'node:child_process'

const env = { ...process.env }

;(async () => {
  // If running the web server then migrate existing database.
  if (process.argv.slice(2).join(' ') === 'npm run start') {
    await exec('npx prisma migrate deploy')
  }

  // Run the seed script before starting the web server.
  // Comment me out after the first deployment ❗.
  await exec('npx prisma db seed')

  // Launch application.
  await exec(process.argv.slice(2).join(' '))
})()

function exec(command) {
  const child = spawn(command, { shell: true, stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} failed rc=${code}`))
      }
    })
  })
}
