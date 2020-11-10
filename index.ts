import { Rcon } from 'rcon-client/lib';
import { Client, Message } from 'discord.js';
import { env } from 'process';
import * as http from 'http';

// const Database = require("better-sqlite3");

// const db = new Database("verified.db", {verbose: console.log})

const setupEnvVars = () => {
    if (!env.BOT_TOKEN) {
        console.log('Error: BOT_TOKEN is a required environment variable');
        process.exit(1);
    }
    if (!env.HOSTNAME) {
        console.log('Error: HOSTNAME is a required environment variable');
        process.exit(1);
    }
    if (!env.RCON_PASSWORD) {
        console.log('Error: RCON_PASSWORD is a required environment variable');
        process.exit(1);
    }
    if (!env.RCON_PORT) {
        env.RCON_PORT = '25565';
    } else {
        // check if it's a number and it's whole
        if (!Number(env.RCON_PORT) || Number(env.RCON_PORT) % 1 != 0) {
            console.log('Error: RCON_PORT must be a whole number');
        }
    }
    if (!env.CMD_PREFIX) {
        env.CMD_PREFIX = '!';
    }
};

const whitelistCmd = async (rcon: Rcon, msg: Message) => {
    const validator = RegExp('^[a-zA-Z0-9_]{3,20}$');
    const username = msg.content
        .slice(env.CMD_PREFIX.length + 'whitelist'.length)
        .trim();

    if (!validator.test(username)) {
        msg.reply(`Invalid username: "${username}"`);
        return;
    }

    msg.reply(await rcon.send('whitelist add ' + username));
    return;
};

// pass in RCON client before giving function to client.on
const messageHandler = (rcon: Rcon) => async (msg: Message) => {
    if (!msg.content.startsWith(env.CMD_PREFIX)) return;

    const command = msg.content.slice(env.CMD_PREFIX.length);

    if (command == 'ping') {
        msg.reply((await rcon.send('list')) + ':kurochan:');
    } else if (command.slice(0, 'whitelist'.length) == 'whitelist') {
        whitelistCmd(rcon, msg);
    }
};

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
});

async function main() {
    setupEnvVars();

    const rcon = await Rcon.connect({
        host: env.HOSTNAME,
        password: env.RCON_PASSWORD,
    });

    const client = new Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });

    client.on('message', messageHandler(rcon));

    client.login(env.BOT_TOKEN);
    server.listen();
}

main();
