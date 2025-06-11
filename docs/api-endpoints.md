---
id: api-endpoints
title: API Endpoint Documentation
sidebar_label: API Endpoints
---

# API Endpoint Documentation (/api/v1)

## Public Routes (No Auth)

- **GET /jobs**
  - Query Params: `page`, `limit`, `category`, `location`, `batch`, `tags`, `q` (search term)
  - Returns: Paginated active jobs
- **GET /jobs/:id**
  - Returns: Single job details
- **GET /sarkari-jobs**
  - Query Params: `page`, `lift`, `organization`
  - Returns: Paginated government jobs
- **GET /sarkari-results**
  - Returns: Government jobs with `status: result-out`
- **POST /subscribe**
  - Body: `{ email, categories }`
  - Subscribes user to newsletter
- **POST /ai/analyze-cv**
  - Body: `{ jobId, cvS3Key }`
  - Returns: AI analysis (score, strengths, weaknesses, improvements)
- **GET /s3/pre-signed-url**
  - Returns: Pre-signed URL for CV upload

## Admin Routes (JWT Auth)

- **POST /admin/login**
  - Body: `{ email, password }`
  - Returns: JWT token
- **Private Jobs:**
  - **POST /admin/jobs**: Create single job
  - **POST /admin/jobs/bulk**: Upload jobs via Excel/CSV
  - **PUT /admin/jobs/:id**: Update job
  - **DELETE /admin/jobs/:id**: Delete job
- **Sarkari Jobs:**
  - **POST /admin/sarkari-jobs**: Create single job
  - **POST /admin/sarkari-jobs/bulk**: Upload jobs via Excel/CSV
  - **PUT /admin/sarkari-jobs/:id**: Update job