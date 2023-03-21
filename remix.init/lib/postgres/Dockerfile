# Base node image.
FROM node:16-bullseye-slim as base

# Set global environment variables.
ENV NODE_ENV=production

# Install openssl for Prisma.
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies.
FROM base as deps

WORKDIR /myapp

ADD package.json ./
RUN npm install --production=false

# Setup production node_modules.
FROM base as production-deps

WORKDIR /myapp
COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD package.json ./
RUN npm prune --production

# Build the app.
FROM base as build

WORKDIR /myapp
COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint.
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh

ENTRYPOINT [ "./start.sh" ]