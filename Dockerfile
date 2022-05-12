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


FROM maulik9898/prisma-node:18.1.0-alpine

WORKDIR /app

COPY package*.json ./

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/bin ./bin
COPY --from=base /app/prisma ./prisma


CMD  [ "sh","bin/startup.sh" ]