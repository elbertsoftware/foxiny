import Redis from 'ioredis';

const cache = new Redis(process.env.REDIS_ENDPOINT);
cache.connect(() => console.log('⚡ foxiny-cache connected'));

export default cache;
