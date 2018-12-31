import redis from 'redis';
import util from 'util';

const cache = redis.createClient(process.env.REDIS_ENDPOINT);

// convert callback style methods to promise where async/await applied
cache.hget = util.promisify(cache.hget);

cache.on('error', error => console.log(`⚡ foxiny-cache errored out: ${error}`));

export default cache;
