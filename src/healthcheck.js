const http = require('http');

const options = {
    host: 'localhost',
    port: 5000,
    timeout: 5000,
};

const request = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

request.on('error', (err) => {
    console.error(`ERROR: ${err}`);
    process.exit(1);
});

request.end();
