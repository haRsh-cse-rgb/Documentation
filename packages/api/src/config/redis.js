const Redis = require('ioredis');

let redis = null;
let redisAvailable = false;

// Only attempt Redis connection if explicitly configured
const shouldConnectRedis = process.env.REDIS_HOST && process.env.REDIS_HOST !== 'localhost' || process.env.NODE_ENV === 'production';

if (shouldConnectRedis) {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately
  });

  redis.on('connect', () => {
    console.log('✅ Connected to Redis');
    redisAvailable = true;
  });

  redis.on('error', (err) => {
    console.warn('⚠️  Redis connection failed, running without cache:', err.message);
    redisAvailable = false;
  });

  // Test connection
  redis.ping().catch(() => {
    console.warn('⚠️  Redis server not available, running without cache');
    redisAvailable = false;
  });
} else {
  console.log('ℹ️  Redis not configured, running without cache');
}

// Wrapper functions that handle Redis unavailability gracefully
const redisWrapper = {
  async get(key) {
    if (!redisAvailable || !redis) return null;
    try {
      return await redis.get(key);
    } catch (err) {
      console.warn('Redis GET error:', err.message);
      return null;
    }
  },

  async set(key, value, ttl = null) {
    if (!redisAvailable || !redis) return false;
    try {
      if (ttl) {
        return await redis.setex(key, ttl, value);
      }
      return await redis.set(key, value);
    } catch (err) {
      console.warn('Redis SET error:', err.message);
      return false;
    }
  },

  async del(key) {
    if (!redisAvailable || !redis) return false;
    try {
      return await redis.del(key);
    } catch (err) {
      console.warn('Redis DEL error:', err.message);
      return false;
    }
  },

  async exists(key) {
    if (!redisAvailable || !redis) return false;
    try {
      return await redis.exists(key);
    } catch (err) {
      console.warn('Redis EXISTS error:', err.message);
      return false;
    }
  },

  isAvailable() {
    return redisAvailable;
  }
};

module.exports = redisWrapper;