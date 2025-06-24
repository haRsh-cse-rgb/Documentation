# JobQuest - Complete Job Board Platform

A scalable, clutter-free job aggregation platform with AI-powered CV analysis and personalized job recommendations.

## 🚀 Features

- **Curated Job Listings**: Admin-managed job postings for quality assurance
- **Advanced Filtering**: Fast, intuitive filtering by category, location, batch, and skills
- **AI-Powered CV Analysis**: Upload CVs for instant compatibility scoring and feedback
- **Suggested Jobs**: Personalized job recommendations based on CV analysis
- **Newsletter Subscriptions**: Category-specific email updates
- **Sarkari Jobs**: Dedicated section for government job opportunities
- **High Availability**: Multiple server instances with automatic failover
- **Load Balancing**: Intelligent request distribution across servers
- **Responsive Design**: Optimized for all devices
- **SEO Optimized**: Built for search engine visibility

## 🛠 Tech Stack

### Frontend
- **Next.js 13** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **AWS DynamoDB** for database (with fallback)
- **AWS S3** for file storage
- **Redis** for caching (with fallback)
- **Apache Kafka** for message queuing
- **Google Gemini API** for AI analysis

### Infrastructure
- **Docker** for containerization
- **PM2** for process management
- **Load Balancer** for high availability
- **Health Checks** for monitoring
- **Graceful Shutdown** handling

## 🏗 High Availability Architecture

### Multiple Server Configuration

The platform supports multiple server instances with automatic failover:

1. **Load Balancer**: Distributes requests across healthy servers
2. **Primary Server**: Main application server (Port 5000)
3. **Secondary Server**: Backup server (Port 5001)
4. **Tertiary Server**: Additional backup (Port 5002)

### Database Redundancy

- **Primary DynamoDB**: Main database in us-east-1
- **Fallback DynamoDB**: Backup database in us-west-2
- **Automatic Failover**: Switches to fallback on primary failure

### Cache Redundancy

- **Primary Redis**: Main cache server (Port 6379)
- **Fallback Redis**: Backup cache server (Port 6380)
- **Mock Client**: WebContainer fallback for development

## 📁 Project Structure

```
jobquest-platform/
├── packages/
│   ├── api/                 # Backend Express.js App
│   │   ├── src/
│   │   │   ├── api/v1/      # API routes and controllers
│   │   │   ├── config/      # Database, Redis, and server configs
│   │   │   ├── services/    # External service integrations
│   │   │   ├── middleware/  # Health checks and error handling
│   │   │   └── jobs/        # Background jobs
│   │   ├── ecosystem.config.js  # PM2 configuration
│   │   ├── load-balancer.js     # Load balancer entry point
│   │   └── package.json
│   │
│   └── web/                 # Frontend Next.js App
│       ├── app/             # Next.js App Router
│       ├── components/      # React components
│       └── package.json
│
├── docker-compose.yml       # Multi-container setup
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose (for production)
- AWS Account (for DynamoDB, S3)
- Redis instances (optional for development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobquest-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   cp .env.example packages/web/.env.local
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

### Production Deployment

#### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option 2: PM2 Process Manager

```bash
# Install PM2 globally
npm install -g pm2

# Start all API instances
cd packages/api
npm run start:pm2

# Start load balancer
node load-balancer.js

# Monitor processes
pm2 monit
```

#### Option 3: Manual Multi-Server Setup

```bash
# Terminal 1 - Primary Server
cd packages/api
PORT=5000 npm start

# Terminal 2 - Secondary Server
cd packages/api
PORT=5001 npm start

# Terminal 3 - Tertiary Server
cd packages/api
PORT=5002 npm start

# Terminal 4 - Load Balancer
cd packages/api
node load-balancer.js

# Terminal 5 - Frontend
cd packages/web
npm start
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# API Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
LOAD_BALANCER_PORT=8080

# AWS Configuration (Primary)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# AWS Configuration (Fallback)
AWS_REGION_FALLBACK=us-west-2
AWS_ACCESS_KEY_ID_FALLBACK=your_aws_access_key_id_fallback
AWS_SECRET_ACCESS_KEY_FALLBACK=your_aws_secret_access_key_fallback

# Redis Configuration (Primary)
REDIS_HOST=localhost
REDIS_PORT=6379

# Redis Configuration (Fallback)
REDIS_HOST_FALLBACK=localhost
REDIS_PORT_FALLBACK=6380
```

#### Frontend (packages/web/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

## 🏥 Health Monitoring

### Health Check Endpoints

- **Load Balancer**: `http://localhost:8080/health`
- **Primary API**: `http://localhost:5000/health`
- **Secondary API**: `http://localhost:5001/health`
- **Tertiary API**: `http://localhost:5002/health`

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 1640995200000
    },
    "redis": {
      "status": "healthy",
      "responseTime": 1640995200000
    }
  },
  "server": {
    "pid": 12345,
    "uptime": 3600,
    "memory": {...},
    "cpu": {...}
  }
}
```

## 🔄 Load Balancing

### Features

- **Round-Robin Distribution**: Requests distributed evenly across servers
- **Health Monitoring**: Automatic detection of server failures
- **Automatic Failover**: Failed servers removed from rotation
- **Recovery Detection**: Failed servers automatically re-added when healthy
- **Request Logging**: All proxy requests logged for monitoring

### Load Balancer Configuration

```javascript
const servers = [
  { name: 'primary', host: 'localhost', port: 5000, priority: 1 },
  { name: 'secondary', host: 'localhost', port: 5001, priority: 2 },
  { name: 'tertiary', host: 'localhost', port: 5002, priority: 3 }
];
```

## 🛡️ Failover Mechanisms

### Database Failover

1. **Primary DynamoDB** fails
2. **Automatic detection** via health checks
3. **Switch to fallback** DynamoDB in different region
4. **Continue operations** with minimal disruption

### Cache Failover

1. **Primary Redis** fails
2. **Automatic detection** via connection monitoring
3. **Switch to fallback** Redis instance
4. **Graceful degradation** if both fail (mock client)

### Server Failover

1. **Server health check** fails
2. **Remove from load balancer** rotation
3. **Distribute traffic** to remaining healthy servers
4. **Monitor for recovery** and re-add when healthy

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# View process status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart specific app
pm2 restart jobquest-api-primary
```

### Docker Monitoring

```bash
# View container status
docker-compose ps

# View logs
docker-compose logs -f api-primary

# Restart specific service
docker-compose restart api-primary
```

## 🔒 Security Features

- **JWT authentication** for admin routes
- **Rate limiting** on API endpoints
- **Input validation** and sanitization
- **CORS configuration**
- **Helmet.js security** headers
- **Graceful error handling**
- **Request ID tracking**

## 📈 Performance Optimizations

- **Load balancing** across multiple servers
- **Database failover** for high availability
- **Redis caching** with fallback
- **Connection pooling**
- **Graceful shutdown** handling
- **Memory management** with PM2
- **Health monitoring** and auto-recovery

## 🧪 Testing High Availability

### Test Server Failover

```bash
# Stop primary server
pm2 stop jobquest-api-primary

# Verify load balancer removes it from rotation
curl http://localhost:8080/health

# Restart server
pm2 start jobquest-api-primary

# Verify it's added back to rotation
curl http://localhost:8080/health
```

### Test Database Failover

```bash
# Simulate primary database failure
# (Configure invalid credentials for primary)

# Make API request
curl http://localhost:8080/api/v1/jobs

# Check logs for fallback activation
docker-compose logs api-primary
```

## 🚀 Scaling

### Horizontal Scaling

- Add more server instances to `serverConfig.js`
- Update Docker Compose with additional services
- Configure load balancer to include new servers

### Vertical Scaling

- Increase PM2 instance count in `ecosystem.config.js`
- Adjust Docker resource limits
- Optimize memory settings

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test with multiple server setup
4. Ensure health checks pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check health endpoints for system status
- Review logs for error details
- Create an issue on GitHub
- Contact the development team

## 🔮 Roadmap

- [ ] Kubernetes deployment configuration
- [ ] Advanced monitoring with Prometheus/Grafana
- [ ] Auto-scaling based on load
- [ ] Circuit breaker pattern implementation
- [ ] Distributed tracing
- [ ] Blue-green deployment strategy
- [ ] Database read replicas
- [ ] CDN integration for static assets