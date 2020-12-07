import { DynamoDB, Endpoint } from 'aws-sdk';
import { Tedis } from 'tedis';

const env = process.env;
const isProd = env.NODE_ENV === 'production';

export const setupRedisConnection = (): Tedis => {
    console.info('Setting up Redis Connection');
    if (isProd) {
        const { hostname, port, password } = new URL(
            env.REDIS_URL || 'localhost'
        );
        return new Tedis({ host: hostname, port: +port, password: password });
    }
    const tedis = new Tedis({
        port: 6379,
        host: isProd ? 'localhost' : 'localhost',
    });
    return tedis;
};

export const setupDynamoConnection = (): DynamoDB => {
    console.info('Setting up DynamoDB Connection');
    if (isProd) {
        return new DynamoDB();
    } else {
        console.info('Local DynamoDB instance');
        return new DynamoDB({
            endpoint: new Endpoint('http://localhost:8000'),
        });
    }
};

export const setupEnvVars = () => {
    if (!env.BOT_TOKEN) {
        console.log('Error: BOT_TOKEN is a required environment variable');
        process.exit(1);
    }
    // if (!env.HOSTNAME) {
    //     console.log('Error: HOSTNAME is a required environment variable');
    //     process.exit(1);
    // }
    // if (!env.RCON_PASSWORD) {
    //     console.log('Error: RCON_PASSWORD is a required environment variable');
    //     process.exit(1);
    // }
    if (!env.RCON_PORT) {
        env.RCON_PORT = '25565';
    }
    // else {
    //     // check if it's a number and it's whole
    //     if (!Number(env.RCON_PORT) || Number(env.RCON_PORT) % 1 != 0) {
    //         console.log('Error: RCON_PORT must be a whole number');
    //     }
    // }
    if (!env.CMD_PREFIX) {
        env.CMD_PREFIX = '!';
    }
};
