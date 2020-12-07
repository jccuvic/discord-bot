# we use a builder image/stage
FROM mhart/alpine-node:12 as builder
WORKDIR /app
# copy npm and app stuff
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm ci \
    && npm run build

FROM mhart/alpine-node:12 as prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --prod

FROM mhart/alpine-node:slim-12 as runner 
WORKDIR /app
COPY --from=builder /app/dist ./
COPY --from=prod /app/node_modules ./node_modules

ENV BOT_TOKEN= \
    HOSTNAME= \
    RCON_PASSWORD= \
    RCON_PORT= \
    CMD_PREFIX=

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "dist/healthcheck.js" ]

CMD ["node", "index.js"]