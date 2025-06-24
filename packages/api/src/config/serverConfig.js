const servers = [
  {
    name: 'primary',
    host: 'localhost',
    port: 5000,
    priority: 1
  },
  {
    name: 'secondary',
    host: 'localhost',
    port: 5001,
    priority: 2
  },
  {
    name: 'tertiary',
    host: 'localhost',
    port: 5002,
    priority: 3
  }
];

const databaseConfig = {
  primary: {
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DYNAMODB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  },
  fallback: {
    region: process.env.AWS_REGION_FALLBACK || 'us-west-2',
    endpoint: process.env.DYNAMODB_ENDPOINT_FALLBACK,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_FALLBACK,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_FALLBACK,
    }
  }
};

const redisConfig = {
  primary: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  fallback: {
    host: process.env.REDIS_HOST_FALLBACK || 'localhost',
    port: process.env.REDIS_PORT_FALLBACK || 6380,
    password: process.env.REDIS_PASSWORD_FALLBACK,
  }
};

module.exports = {
  servers,
  databaseConfig,
  redisConfig
};