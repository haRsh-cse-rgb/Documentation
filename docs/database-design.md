---
id: database-design
title: Database Schema Design (AWS DynamoDB)
sidebar_label: Database Design
---

# Database Schema Design (AWS DynamoDB)

DynamoDB uses a key-value structure with partition and sort keys for efficient querying. Indexes are added for filtering.

## `Jobs` Table (Private Sector)

- **Partition Key:** `category` (e.g., "Software", "HR")
- **Sort Key:** `jobId` (UUID)
- **Attributes:**
  - `role`: String, required (e.g., "Frontend Developer")
  - `companyName`: String, required
  - `companyLogo`: String, required (S3 URL)
  - `location`: String, required
  - `salary`: String, required (e.g., "₹10-15 LPA")
  - `jobDescription`: String, required
  - `originalLink`: String, required, unique
  - `postedOn`: String, ISO date, default now
  - `expiresOn`: String, ISO date, required
  - `tags`: String set (e.g., ["frontend", "react"])
  - `batch`: String set (e.g., ["2024", "2025"])
  - `status`: String, "active" or "expired", default "active"
- **Global Secondary Indexes (GSI):**
  - `LocationIndex`: Partition key `location`, sort key `postedOn`
  - `BatchIndex`: Partition key `batch`, sort key `postedOn`
  - `StatusIndex`: Partition key `status`, sort key `postedOn`

## `SarkariJobs` Table

- **Partition Key:** `organization` (e.g., "UPSC", "SSC")
- **Sort Key:** `jobId` (UUID)
- **Attributes:**
  - `postName`: String, required (e.g., "Civil Services")
  - `advertisementNo`: String
  - `importantDates`: Map `{ applicationStart, applicationEnd, examDate }`
  - `applicationFee`: String
  - `vacancyDetails`: String
  - `eligibility`: String
  - `officialWebsite`: String, required
  - `notificationLink`: String, required
  - `applyLink`: String
  - `resultLink`: String
  - `status`: String, "active", "result-out", or "closed", default "active"
- **GSI:**
  - `StatusIndex`: Partition key `status`, sort key `jobId`

## `Admins` Table

- **Partition Key:** `email`
- **Attributes:**
  - `password`: String, hashed
  - `role`: String, "superadmin" or "editor"
  - `createdAt`: String, ISO date

## `Subscriptions` Table

- **Partition Key:** `email`
- **Sort Key:** `category`
- **Attributes:**
  - `subscribedAt`: String, ISO date
- **GSI:**
  - `CategoryIndex`: Partition key `category`, sort key `subscribedAt`

