const http = require('http');
const httpProxy = require('http-proxy-middleware');

class LoadBalancer {
  constructor(servers) {
    this.servers = servers;
    this.currentIndex = 0;
    this.healthyServers = [...servers];
    this.healthCheckInterval = 30000; // 30 seconds
    
    this.startHealthChecks();
  }

  // Round-robin load balancing
  getNextServer() {
    if (this.healthyServers.length === 0) {
      throw new Error('No healthy servers available');
    }
    
    const server = this.healthyServers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.healthyServers.length;
    return server;
  }

  // Health check for servers
  async checkServerHealth(server) {
    return new Promise((resolve) => {
      const options = {
        hostname: server.host,
        port: server.port,
        path: '/health',
        method: 'GET',
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        resolve(res.statusCode === 200);
      });

      req.on('error', () => {
        resolve(false);
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });

      req.end();
    });
  }

  // Start periodic health checks
  startHealthChecks() {
    setInterval(async () => {
      console.log('🔍 Performing health checks...');
      
      for (const server of this.servers) {
        const isHealthy = await this.checkServerHealth(server);
        const isCurrentlyHealthy = this.healthyServers.includes(server);
        
        if (isHealthy && !isCurrentlyHealthy) {
          console.log(`✅ Server ${server.host}:${server.port} is back online`);
          this.healthyServers.push(server);
        } else if (!isHealthy && isCurrentlyHealthy) {
          console.log(`❌ Server ${server.host}:${server.port} is down`);
          this.healthyServers = this.healthyServers.filter(s => s !== server);
        }
      }
      
      console.log(`📊 Healthy servers: ${this.healthyServers.length}/${this.servers.length}`);
    }, this.healthCheckInterval);
  }

  // Create proxy middleware
  createProxy() {
    return httpProxy({
      target: () => {
        const server = this.getNextServer();
        return `http://${server.host}:${server.port}`;
      },
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
        res.status(503).json({
          error: 'Service temporarily unavailable',
          message: 'All servers are down or unreachable'
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying ${req.method} ${req.url} to ${proxyReq.getHeader('host')}`);
      }
    });
  }
}

module.exports = LoadBalancer;