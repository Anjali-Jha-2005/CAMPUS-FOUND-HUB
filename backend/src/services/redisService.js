const { createClient } = require('redis');
const logger = require('../utils/logger');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        return new Error('Redis connection failed after multiple retries');
      }
      return 1000;
    }
  }
});

let isRedisDisabled = false;

redisClient.on('error', (err) => {
  if (!isRedisDisabled) {
    logger.warn('Redis Client Error: Caching will be disabled for this session.');
    isRedisDisabled = true;
  }
});

const connectRedis = async () => {
  try {
    // Use a timeout to avoid hanging server startup
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 2000)
    );
    
    await Promise.race([redisClient.connect(), timeout]);
    logger.info('Redis Connected...');
  } catch (err) {
    logger.warn(`Redis is unavailable: ${err.message}. Continuing without caching.`);
    isRedisDisabled = true;
  }
};


const setCache = async (key, value, duration = 3600) => {
  if (isRedisDisabled || !redisClient.isOpen) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: duration
    });
  } catch (err) {
    logger.error('Redis Set Error', err);
  }
};

const getCache = async (key) => {
  if (!redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.error('Redis Get Error', err);
    return null;
  }
};

const deleteCache = async (key) => {
  if (!redisClient.isOpen) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error('Redis Delete Error', err);
  }
};

module.exports = { connectRedis, setCache, getCache, deleteCache };
