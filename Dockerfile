FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV BOT_TOKEN= \
    HOSTNAME= \
    RCON_PASSWORD= \
    RCON_PORT= \
    CMD_PREFIX=
CMD ["npm", "start"]

