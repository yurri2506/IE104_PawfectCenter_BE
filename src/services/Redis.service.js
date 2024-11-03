// redisClient.js
const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379' // Địa chỉ của Redis (localhost với port mặc định 6379)
});

client.connect().catch(console.error);

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

module.exports = client;
