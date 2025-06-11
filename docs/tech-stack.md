---
id: tech-stack
title: Technology Stack & System Architecture
sidebar_label: Tech Stack
---

# Technology Stack & System Architecture

## Identified Technology Needs

| Component         | Technology                     | Justification                                                                 |
|-------------------|--------------------------------|-------------------------------------------------------------------------------|
| Frontend          | Next.js 14+ (App Router)       | SEO-friendly SSR, fast performance, lazy loading, and Open Graph support.     |
| UI Framework      | Tailwind CSS                   | Utility-first CSS for rapid, clutter-free UI development.                     |
| Backend API       | Node.js with Express.js        | Mature, fast framework for RESTful APIs, handles high concurrency.            |
| Database          | AWS DynamoDB                   | Fully managed NoSQL database, scalable, low-latency, ideal for job data.      |
| Caching Layer     | AWS ElastiCache (Redis)        | Caches frequent queries for fast filtering, reduces DynamoDB load.            |
| Message Queue     | Apache Kafka                   | Decouples services, handles asynchronous newsletter subscriptions.            |
| File Storage      | AWS S3                         | Scalable storage for CVs, supports pre-signed URLs for direct uploads.        |
| AI Integration    | Google Gemini API              | Powers CV analysis and job suggestions.                                       |
| Email Service     | Mailchimp                      | Manages newsletter subscriptions and email campaigns.                         |
| Push Notifications| OneSignal                       | Real-time push notifications for new job postings.                            |
| Background Jobs   | node-cron                      | Schedules tasks like expired job cleanup.                                     |
| Process Manager   | PM2                            | Manages Node.js apps with load balancing and monitoring.                      |
| Analytics/Monitoring | Google Analytics, Search Console, UptimeRobot | Tracks user behavior, SEO, and site availability.                           |

### Additional Tools

- **AWS SDK for JavaScript:** For DynamoDB and S3 interactions.
- **jsonwebtoken:** For admin JWT authentication.
- **express-rate-limit:** Prevents API abuse.
- **helmet:** Secures Express apps with HTTP headers.
- **Docusaurus:** For hosting this documentation.
- **AWS CloudWatch:** Monitors application logs and performance.

## System Architecture Diagram

```mermaid
graph TD
    A[User Browser<br/>(React)] -->|HTTP| B[Next.js Web App<br/>(Vercel/AWS)]
    B -->|API Calls| C[Node.js/Express API<br/>(AWS ECS)]
    B -->|Cache| D[AWS ElastiCache<br/>(Redis)]
    A -->|Direct CV Upload| E[AWS S3<br/>(CV Bucket)]
    C -->|Query| F[AWS DynamoDB<br/>(Job Data)]
    C -->|Events| G[Apache Kafka<br/>(Message Broker)]
    C -->|AI Call| H[Google Gemini API]
    G -->|Consume| I[Notification Service]
    I -->|API Call| J[Mailchimp]
    I -->|Push| K[OneSignal]



