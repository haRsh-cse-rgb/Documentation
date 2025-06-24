const { dbManager } = require('../config/database');
const redisManager = require('../config/redis');

const healthCheck = async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {},
    server: {
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    }
  };

  try {
    // Check database health
    const dbHealthy = await dbManager.healthCheck();
    health.services.database = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      responseTime: Date.now()
    };

    // Check Redis health
    const redisHealthy = await redisManager.healthCheck();
    health.services.redis = {
      status: redisHealthy ? 'healthy' : 'unhealthy',
      responseTime: Date.now()
    };

    // Overall health status
    const allHealthy = dbHealthy && redisHealthy;
    health.status = allHealthy ? 'healthy' : 'degraded';

    const statusCode = allHealthy ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    console.error('❌ Health check error:', error);
    
    health.status = 'unhealthy';
    health.error = error.message;
    
    res.status(503).json(health);
  }
};

module.exports = healthCheck;