FROM rust:1.58.1-alpine3.14 as prisma
ENV RUSTFLAGS="-C target-feature=-crt-static"
RUN apk --no-cache add openssl direnv git musl-dev openssl-dev build-base perl protoc
RUN git clone https://github.com/prisma/prisma-engines.git /prisma && cd /prisma
WORKDIR /prisma
RUN cargo build --release



FROM node:18.1.0 AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY index.ts ./

RUN export NODE_ENV=production

# Install app dependencies
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

RUN npm prune --production



FROM node:18.1.0-alpine



WORKDIR /app

ENV PRISMA_QUERY_ENGINE_BINARY=/prisma-engines/query-engine \
  PRISMA_MIGRATION_ENGINE_BINARY=/prisma-engines/migration-engine \
  PRISMA_INTROSPECTION_ENGINE_BINARY=/prisma-engines/introspection-engine \
  PRISMA_FMT_BINARY=/prisma-engines/prisma-fmt \
  PRISMA_CLI_QUERY_ENGINE_TYPE=binary \
  PRISMA_CLIENT_ENGINE_TYPE=binary
COPY --from=prisma /prisma/target/release/query-engine /prisma/target/release/migration-engine /prisma/target/release/introspection-engine /prisma/target/release/prisma-fmt /prisma-engines/


COPY package*.json ./

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/bin ./bin
COPY --from=base /app/prisma ./prisma


CMD  [ "sh","bin/startup.sh" ]