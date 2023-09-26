const redis = require('redis');
const localtunnel = require('localtunnel');

const redisClient = redis.createClient({
    url: `redis://127.0.0.1:${process.env.REDIS_PORT}`
});

const port = 3000;
let tunnel = null;

(async () => {
  await redisClient.connect();
  tunnel = await localtunnel({ port });
  await redisClient.set('TUNNEL_URL', tunnel.url);
  console.info(`${tunnel.url} tunnel started on port ${port}`);
})();
