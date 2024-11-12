// TODO: this is not the right location for this file,
// I've created it for hackathon purposes only and it can be moved the a proper "lib" location later.
import { createClient } from 'redis';
const REDIS_URL_DEFAULT = 'redis://localhost:6379'
const redis = createClient({url: process.env.REDIS_URL || REDIS_URL_DEFAULT});
redis.on('error', err => console.log('Redis Client Error', err));
(async () => {
    await redis.connect();
})();

export default redis;