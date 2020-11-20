import { DynamoDB, Endpoint } from 'aws-sdk';

export const setupRedisConnection = () => {
    // console.log('Setting up Redis Connection');
};

export const setupDynamoConnection = (): DynamoDB => {
    console.info('Setting up DynamoDB Connection');
    if (process.env.NODE_ENV === 'production') {
        return new DynamoDB();
    } else {
        console.info('Local DynamoDB instance');
        return new DynamoDB({
            endpoint: new Endpoint('http://localhost:8000'),
        });
    }
};
