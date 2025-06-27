const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const healthCheck = require('./middleware/healthCheck');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (must be before other routes)
app.get('/health', healthCheck);

// Routes
app.use('/api/v1/jobs', require('./api/v1/routes/jobs'));
app.use('/api/v1/sarkari-jobs', require('./api/v1/routes/sarkariJobs'));
app.use('/api/v1/sarkari-results', require('./api/v1/routes/sarkariResults'));
app.use('/api/v1/hackathons', require('./api/v1/routes/hackathons'));
app.use('/api/v1/certifications', require('./api/v1/routes/certifications'));
app.use('/api/v1/courses', require('./api/v1/routes/courses'));
app.use('/api/v1/resume-tips', require('./api/v1/routes/resumeTips'));
app.use('/api/v1/admin', require('./api/v1/routes/admin'));
app.use('/api/v1/ai', require('./api/v1/routes/ai'));
app.use('/api/v1/s3', require('./api/v1/routes/s3'));
app.use('/api/v1', require('./api/v1/routes/newsletter'));

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`📴 Received ${signal}, shutting down gracefully...`);
  
  server.close(() => {
    console.log('✅ HTTP server closed');
    
    // Close database connections
    console.log('🔌 Closing database connections...');
    
    // Close Redis connections
    console.log('🔌 Closing Redis connections...');
    
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 JobQuest API running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`👷 Worker PID: ${process.pid}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Start cron jobs
require('./jobs/cleanup');

module.exports = app;