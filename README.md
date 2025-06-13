# JobQuest - Complete Job Board Platform

A scalable, clutter-free job aggregation platform with AI-powered CV analysis and personalized job recommendations.

## 🚀 Features

- **Curated Job Listings**: Admin-managed job postings for quality assurance
- **Advanced Filtering**: Fast, intuitive filtering by category, location, batch, and skills
- **AI-Powered CV Analysis**: Upload CVs for instant compatibility scoring and feedback
- **Suggested Jobs**: Personalized job recommendations based on CV analysis
- **Newsletter Subscriptions**: Category-specific email updates
- **Sarkari Jobs**: Dedicated section for government job opportunities
- **Responsive Design**: Optimized for all devices
- **SEO Optimized**: Built for search engine visibility

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **AWS DynamoDB** for database
- **AWS S3** for file storage
- **Redis** for caching
- **Apache Kafka** for message queuing
- **Google Gemini API** for AI analysis

### Infrastructure
- **AWS** for cloud services
- **Docker** for containerization
- **PM2** for process management

## 📁 Project Structure

```
jobquest-platform/
├── packages/
│   ├── api/                 # Backend Express.js App
│   │   ├── src/
│   │   │   ├── api/v1/      # API routes and controllers
│   │   │   ├── config/      # Database and service configs
│   │   │   ├── services/    # External service integrations
│   │   │   └── jobs/        # Background jobs
│   │   └── package.json
│   │
│   └── web/                 # Frontend Next.js App
│       ├── app/             # Next.js App Router
│       ├── components/      # React components
│       └── package.json
│
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for DynamoDB, S3)
- Redis instance
- Kafka instance (optional for development)

### Installation

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

4. **Configure environment variables**
   
   Edit `.env` and `packages/web/.env.local` with your actual values:

   **Required AWS Services:**
   - DynamoDB tables: `Jobs`, `SarkariJobs`, `Subscriptions`, `Admins`
   - S3 bucket for CV storage
   - IAM user with appropriate permissions

   **Required External Services:**
   - Google Gemini API key
   - Redis instance
   - Mailchimp account (for newsletters)

### Development

1. **Start the development servers**
   ```bash
   npm run dev
   ```

   This starts both:
   - API server on `http://localhost:5000`
   - Web app on `http://localhost:3000`

2. **Start individual services**
   ```bash
   # API only
   npm run dev:api
   
   # Web only
   npm run dev:web
   ```

## 🗄️ Database Setup

### DynamoDB Tables

Create the following tables in AWS DynamoDB:

#### Jobs Table
- **Partition Key**: `category` (String)
- **Sort Key**: `jobId` (String)
- **GSI**: `LocationIndex`, `BatchIndex`, `StatusIndex`

#### SarkariJobs Table
- **Partition Key**: `organization` (String)
- **Sort Key**: `jobId` (String)
- **GSI**: `StatusIndex`

#### Subscriptions Table
- **Partition Key**: `email` (String)
- **Sort Key**: `category` (String)
- **GSI**: `CategoryIndex`

#### Admins Table
- **Partition Key**: `email` (String)

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# API Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# DynamoDB Tables
JOBS_TABLE=Jobs
SARKARI_JOBS_TABLE=SarkariJobs
SUBSCRIPTIONS_TABLE=Subscriptions
ADMINS_TABLE=Admins

# S3 Configuration
CV_BUCKET_NAME=jobquest-cvs

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

#### Frontend (packages/web/.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 📚 API Documentation

### Public Endpoints

- `GET /api/v1/jobs` - Get jobs with filtering
- `GET /api/v1/jobs/:id` - Get single job
- `GET /api/v1/sarkari-jobs` - Get government jobs
- `POST /api/v1/subscribe` - Subscribe to newsletter
- `POST /api/v1/ai/analyze-cv` - Analyze CV against job
- `GET /api/v1/s3/pre-signed-url` - Get CV upload URL

### Admin Endpoints (JWT Required)

- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/admin/jobs` - Create job
- `PUT /api/v1/admin/jobs/:id` - Update job
- `DELETE /api/v1/admin/jobs/:id` - Delete job

## 🎨 Features in Detail

### AI CV Analysis
1. User uploads CV to S3 via pre-signed URL
2. System fetches job description and CV content
3. Gemini API analyzes compatibility
4. Returns score, strengths, weaknesses, and improvements
5. Suggests matching jobs based on skills

### Newsletter System
1. Users subscribe to specific job categories
2. Subscriptions stored in DynamoDB
3. Kafka publishes subscription events
4. Background service processes Mailchimp integration

### Job Filtering
- Real-time search with debouncing
- Category, location, batch year filters
- Skill/tag-based filtering
- Redis caching for performance

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build images
docker build -t jobquest-api ./packages/api
docker build -t jobquest-web ./packages/web

# Run containers
docker run -p 5000:5000 jobquest-api
docker run -p 3000:3000 jobquest-web
```

## 🔒 Security Features

- JWT authentication for admin routes
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Pre-signed URLs for secure file uploads

## 📈 Performance Optimizations

- Redis caching for frequent queries
- DynamoDB GSI for efficient filtering
- Next.js image optimization
- Lazy loading components
- Code splitting
- CDN for static assets

## 🧪 Testing

```bash
# Run API tests
cd packages/api && npm test

# Run web tests
cd packages/web && npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Video interview integration
- [ ] Salary insights and trends
- [ ] Company reviews and ratings
- [ ] Job application tracking
- [ ] Skills assessment tests