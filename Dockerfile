FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ENV BOT_TOKEN=
ENV HOSTNAME=
ENV RCON_PASSWORD=
ENV RCON_PORT=
ENV CMD_PREFIX=
CMD ["npm", "start"]

