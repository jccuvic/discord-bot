import { Rcon } from 'rcon-client/lib';
import { Client, Message } from 'discord.js';
import { env } from 'process';
import * as http from 'http';
import {
    setupDynamoConnection,
    setupRedisConnection,
    setupEnvVars,
} from './setup';
import { Tedis } from 'tedis';
import { DynamoDB } from 'aws-sdk';
import arg from 'arg';

// const whitelistCmd = async (rcon: Rcon, msg: Message) => {
//     const validator = RegExp('^[a-zA-Z0-9_]{3,20}$');
//     const username = msg.content
//         .slice(env.CMD_PREFIX.length + 'whitelist'.length)
//         .trim();

//     if (!validator.test(username)) {
//         msg.reply(`Invalid username: "${username}"`);
//         return;
//     }

//     msg.reply(await rcon.send('whitelist add ' + username));
//     return;
// };

// pass in RCON client before giving function to client.on
const messageRouter = async (msg: Message) => {
    if (msg.content.startsWith('!')) {
        const args = arg(
            {
                '--key': String,
            },
            {
                argv: msg.content
                    .slice((env.CMD_PREFIX || '!').length)
                    .split(/\s+/),
                // stopAtPositional: true,
            }
        );
        const cmd = args._[0] || '';
        if (cmd === 'ping') {
            msg.channel.send('pong');
        }
        // if (cmd === 'config') {
        //     if (args._[1] === 'name') {
        //         const name = args._[2];
        //         msg.member.setNickname(name);
        //     }
        //     msg.channel.send(`config didn't break!`);
        // } else if (cmd == 'ping') {
        //     msg.reply(await rcon.send('list'));
        // } else if (cmd.slice(0, 'whitelist'.length) == 'whitelist') {
        //     whitelistCmd(rcon, msg);
        // }
    }
};

// For Dokku health checks
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
});

async function main() {
    // const db = setupDynamoConnection();
    // const redis = setupRedisConnection();
    setupEnvVars();

    // const rcon = await Rcon.connect({
    //     host: env.HOSTNAME,
    //     password: env.RCON_PASSWORD,
    // });

    const client = new Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user?.tag || ''}`);
    });

    client.on('message', messageRouter);

    client.login(env.BOT_TOKEN);
    server.listen(5000);
}

main();
