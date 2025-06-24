const Redis = require('ioredis');
const { redisConfig } = require('./serverConfig');

class RedisManager {
  constructor() {
    this.primaryClient = null;
    this.fallbackClient = null;
    this.currentClient = null;
    this.isWebContainer = process.env.NODE_ENV === 'development' && !process.env.REDIS_HOST;
    
    this.initializeClients();
  }

  initializeClients() {
    if (this.isWebContainer) {
      console.log('⚠️  Running in WebContainer - using mock Redis client');
      this.currentClient = this.createMockClient();
      return;
    }

    try {
      // Primary Redis client
      this.primaryClient = new Redis({
        ...redisConfig.primary,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 5000,
        commandTimeout: 5000,
      });

      // Fallback Redis client
      if (redisConfig.fallback.host) {
        this.fallbackClient = new Redis({
          ...redisConfig.fallback,
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          connectTimeout: 5000,
          commandTimeout: 5000,
        });
      }

      this.currentClient = this.primaryClient;
      this.setupEventHandlers();
      
      console.log('✅ Redis clients initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Redis clients:', error);
      this.currentClient = this.createMockClient();
    }
  }

  createMockClient() {
    return {
      get: async (key) => {
        console.log(`Mock Redis GET: ${key}`);
        return null;
      },
      set: async (key, value, ...args) => {
        console.log(`Mock Redis SET: ${key} = ${value}`);
        return 'OK';
      },
      setex: async (key, seconds, value) => {
        console.log(`Mock Redis SETEX: ${key} = ${value} (${seconds}s)`);
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
      ping: async () => {
        console.log('Mock Redis PING');
        return 'PONG';
      },
      on: () => {},
      off: () => {},
      emit: () => {},
      status: 'ready'
    };
  }

  setupEventHandlers() {
    if (this.primaryClient) {
      this.primaryClient.on('connect', () => {
        console.log('✅ Connected to primary Redis');
      });

      this.primaryClient.on('error', (err) => {
        console.error('❌ Primary Redis error:', err.message);
        this.switchToFallback();
      });
    }

    if (this.fallbackClient) {
      this.fallbackClient.on('connect', () => {
        console.log('✅ Connected to fallback Redis');
      });

      this.fallbackClient.on('error', (err) => {
        console.error('❌ Fallback Redis error:', err.message);
      });
    }
  }

  switchToFallback() {
    if (this.fallbackClient && this.currentClient === this.primaryClient) {
      console.log('🔄 Switching to fallback Redis...');
      this.currentClient = this.fallbackClient;
    }
  }

  async executeWithFallback(method, ...args) {
    try {
      return await this.currentClient[method](...args);
    } catch (error) {
      console.error(`❌ Redis ${method} error:`, error.message);
      
      if (this.fallbackClient && this.currentClient === this.primaryClient) {
        console.log('🔄 Trying fallback Redis...');
        this.currentClient = this.fallbackClient;
        
        try {
          return await this.currentClient[method](...args);
        } catch (fallbackError) {
          console.error(`❌ Fallback Redis ${method} error:`, fallbackError.message);
          return null;
        }
      }
      
      return null;
    }
  }

  // Proxy methods to current client with fallback
  async get(key) {
    return this.executeWithFallback('get', key);
  }

  async set(key, value, ...args) {
    return this.executeWithFallback('set', key, value, ...args);
  }

  async setex(key, seconds, value) {
    return this.executeWithFallback('setex', key, seconds, value);
  }

  async del(key) {
    return this.executeWithFallback('del', key);
  }

  async exists(key) {
    return this.executeWithFallback('exists', key);
  }

  async expire(key, seconds) {
    return this.executeWithFallback('expire', key, seconds);
  }

  async flushall() {
    return this.executeWithFallback('flushall');
  }

  async ping() {
    return this.executeWithFallback('ping');
  }

  async healthCheck() {
    try {
      const result = await this.ping();
      return result === 'PONG';
    } catch (error) {
      return false;
    }
  }
}

const redisManager = new RedisManager();

module.exports = redisManager;