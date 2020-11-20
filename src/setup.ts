import { DynamoDB, Endpoint } from 'aws-sdk';
import { Tedis } from 'tedis';

const isProd = process.env.NODE_ENV === 'production';

export const setupRedisConnection = (): Tedis => {
    console.info('Setting up Redis Connection');
    if(isProd){
        return new Tedis({host: process.env.REDIS_URL});
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
