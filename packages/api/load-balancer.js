const express = require('express');
const LoadBalancer = require('./src/config/loadBalancer');
const { servers } = require('./src/config/serverConfig');

const app = express();
const PORT = process.env.LOAD_BALANCER_PORT || 8080;

// Initialize load balancer
const loadBalancer = new LoadBalancer(servers);

// Health check for load balancer
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    loadBalancer: 'running',
    healthyServers: loadBalancer.healthyServers.length,
    totalServers: loadBalancer.servers.length,
    timestamp: new Date().toISOString()
  });
});

// Proxy all other requests
app.use('*', loadBalancer.createProxy());

app.listen(PORT, () => {
  console.log(`🔄 Load Balancer running on port ${PORT}`);
  console.log(`📊 Managing ${servers.length} backend servers`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});