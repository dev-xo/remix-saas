# This file is how Fly starts the server (configured in fly.toml). 
# Before starting the server, we need to run any prisma migrations that haven't yet been run.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

set -ex
npx prisma migrate deploy
npx node prisma/seed/prisma/seed.js
npm run start
