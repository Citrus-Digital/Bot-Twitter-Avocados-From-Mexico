const redis = require('async-redis');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

console.log("Connect redis in: ", `${process.env.REDIS_PORT}:${process.env.REDIS_HOST}`);

module.exports = client