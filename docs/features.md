---
id: features
title: Key Features, SEO, Security, and Collaboration
sidebar_label: Features & Best Practices
---

# Key Feature Implementation Details

## AI CV Analysis & Suggested Jobs

1. User requests pre-signed S3 URL (`GET /s3/pre-signed-url`).
2. User uploads CV to S3 asynchronously.
3. User triggers analysis (`POST /ai/analyze-cv`).
4. Backend fetches job description from DynamoDB and CV from S3.
5. Structured prompt sent to Gemini API for analysis (score, strengths, weaknesses, improvements).
6. Results displayed in a modal.
7. Suggested jobs fetched based on CV analysis, shown in sidebar.

**Tech Details:**
- **S3 Upload:** Use `aws-sdk` for pre-signed URLs.
- **Gemini API:** Structured prompt with job description and CV text.
- **Suggested Jobs:** Query DynamoDB with tags from CV analysis.

## Fast Filtering & Search

- **DynamoDB Indexes:** GSIs on `location`, `batch`, and `status` for efficient queries.
- **Redis Caching:** Cache frequent filter combinations (e.g., `category:Software,location:Bangalore`).
- **Pagination:** Limit 15 jobs per page, use DynamoDB’s `LastEvaluatedKey`.
- **Search:** Use DynamoDB’s `contains` for tags or full-text search with AWS OpenSearch (optional).

## Asynchronous Newsletter System

1. User subscribes (`POST /subscribe`).
2. API publishes event to Kafka `new-subscriptions` topic.
3. Notification service consumes event, calls Mailchimp API for specific categories.
4. OneSignal used for push notifications.

**Tech Details:**
- **Kafka:** Topics for subscriptions and notifications.
- **Mailchimp:** Category-specific email lists.
- **OneSignal:** Push notifications for new jobs.

## Admin Bulk Upload

### Private Jobs (`POST /admin/jobs/bulk`)

- **Excel/CSV Template:**
  - Columns: `role`, `companyName`, `companyLogo`, `location`, `salary`, `jobDescription`, `originalLink`, `tags`, `category`, `batch`, `expiresOn`
- **Process:**
  - Parse file using `xlsx` or `csv-parse`.
  - Validate rows against schema.
  - Batch write to DynamoDB using `BatchWriteItem`.
  - Return success/failure report.

### Sarkari Jobs (`POST /admin/sarkari-jobs/bulk`)

- **Excel/CSV Template:**
  - Columns: `postName`, `organization`, `advertisementNo`, `applicationStart`, `applicationEnd`, `examDate`, `applicationFee`, `vacancyDetails`, `eligibility`, `officialWebsite`, `notificationLink`, `applyLink`, `resultLink`
- **Process:** Same as private jobs.

## Background Cron Job

```javascript
// packages/api/src/jobs/cleanup.js
const cron = require('node-cron');
const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

cron.schedule('0 0 * * *', async () => {
  // Update jobs where expiresOn < now and status is active
  const params = {
    TableName: 'Jobs',
    Key: { /* Query active jobs */ },
    UpdateExpression: 'SET #status = :expired',
    ConditionExpression: '#expiresOn < :now AND #status = :active',
    ExpressionAttributeNames: {
      '#status': 'status',
      '#expiresOn': 'expiresOn',
    },
    ExpressionAttributeValues: {
      ':expired': { S: 'expired' },
      ':now': { S: new Date().toISOString() },
      ':active': { S: 'active' },
    },
  };
  await new DynamoDBClient().send(new UpdateItemCommand(params));
});

Admin Authentication

No User Login/Signup: Only admins can log in.
JWT Auth: Admins log in via /admin/login, receive JWT stored in HTTP-only cookies.
Security: Use bcrypt for password hashing, jsonwebtoken for tokens.

SEO & Performance Best Practices
Technical SEO

Schema Markup: Use JobPosting JSON-LD on job detail pages for rich snippets.
Dynamic Sitemap: Next.js generates sitemap for active jobs, submitted to Google Search Console.
robots.txt: Allow public pages, disallow /admin, point to sitemap.
Canonical URLs: Prevent duplicate content from filter params.
Open Graph Tags: Auto-generated for social sharing.

On-Page SEO

Dynamic Metadata: Unique <title> and <meta name="description"> per page.
Job Page Title: {role} at {companyName} in {location}


Clean URLs: /jobs/{id}/{role-at-company-in-location}

Performance

Core Web Vitals: Use Next.js <Image> for optimization, SSR for fast loads, next/dynamic for code-splitting.
Lazy Loading: Enabled for images and non-critical components.
Caching: Redis for API responses, Next.js for static pages.

Security Considerations

JWT Security: Short-lived tokens, refresh tokens, HTTP-only cookies.
Rate Limiting: express-rate-limit for API endpoints.
Input Validation: Use express-validator for all inputs.
CORS: Restrict to trusted origins.
S3 Security: Pre-signed URLs with expiration, least privilege IAM roles.
GDPR Compliance: Consent for newsletter subscriptions, delete CVs after analysis.

Corner Cases & Pro Tips
Corner Cases

Duplicate Jobs: Check originalLink uniqueness in DynamoDB.
Invalid Excel/CSV: Validate file format and required fields, provide detailed error reports.
Expired Jobs: Auto-expire after 15 days unless specified.
High Traffic: Use AWS Auto Scaling for API and ElastiCache for caching.
AI Errors: Handle Gemini API failures with fallback messages.

Pro Tips

DynamoDB Streams: Trigger notifications for new jobs.
CloudFront: Use for S3 CV access and static assets.
Error Tracking: Integrate Sentry for real-time error monitoring.
Testing: Use Jest for unit tests, Cypress for E2E tests.
CI/CD: Use GitHub Actions for automated deployment to AWS.

Team Collaboration

Frontend (1-2 devs): Build Next.js app, Tailwind UI, filters, and CV upload.
Backend (1-2 devs): Develop Express API, DynamoDB, Kafka, and AI integration.
DevOps (1 dev): Set up AWS infrastructure, CI/CD, and monitoring.
Documentation: Store in docs/ folder, use Docusaurus for team access.



