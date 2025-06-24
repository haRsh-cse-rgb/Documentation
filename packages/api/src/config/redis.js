const Redis = require('ioredis');

// Check if we're in a WebContainer environment or if Redis is not available
const isWebContainer = process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST;

let redis;

if (isWebContainer) {
  // Create a mock Redis client for WebContainer environment
  console.log('⚠️  Running in WebContainer - using mock Redis client');
  
  redis = {
    // Mock Redis methods
    get: async (key) => {
      console.log(`Mock Redis GET: ${key}`);
      return null;
    },
    set: async (key, value, ...args) => {
      console.log(`Mock Redis SET: ${key} = ${value}`);
      return 'OK';
    },
    del: async (key) => {
      console.log(`Mock Redis DEL: ${key}`);
      return 1;
    },
    exists: async (key) => {
      console.log(`Mock Redis EXISTS: ${key}`);
      return 0;
    },
    expire: async (key, seconds) => {
      console.log(`Mock Redis EXPIRE: ${key} in ${seconds}s`);
      return 1;
    },
    flushall: async () => {
      console.log('Mock Redis FLUSHALL');
      return 'OK';
    },
    // Event emitter methods
    on: (event, callback) => {
      if (event === 'connect') {
        setTimeout(() => callback(), 100);
      }
    },
    off: () => {},
    emit: () => {},
    // Connection status
    status: 'ready'
  };
  
  console.log('✅ Mock Redis client initialized');
} else {
  // Use real Redis client
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true, // Don't connect immediately
    connectTimeout: 5000,
    commandTimeout: 5000,
  });

  redis.on('connect', () => {
    console.log('✅ Connected to Redis');
  });

  redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
    console.log('💡 Tip: Make sure Redis is running or check your Redis configuration');
  });

  redis.on('close', () => {
    console.log('⚠️  Redis connection closed');
  });

  // Test connection on startup
  redis.ping().catch((err) => {
    console.error('❌ Redis ping failed:', err.message);
    console.log('💡 Continuing without Redis - some features may be limited');
  });
}

module.exports = redis;