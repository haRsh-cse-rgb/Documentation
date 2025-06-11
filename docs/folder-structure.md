---
id: folder-structure
title: Project & Folder Structure
sidebar_label: Folder Structure
---

# Project & Folder Structure

A monorepo managed with `pnpm` workspaces ensures scalability and collaboration.

job-board-mono/
├── packages/
│   ├── api/                 # Backend Express.js App
│   │   ├── src/
│   │   │   ├── api/         # API versioning (e.g., v1)
│   │   │   │   ├── routes/      # Express routes (jobs.js, sarkari.js, admin.js, ai.js)
│   │   │   │   ├── controllers/ # Logic for routes
│   │   │   │   ├── models/      # MongoDB schemas
│   │   │   │   └── middleware/  # Auth, error handling, validation
│   │   ├── services/      # External service clients (s3, gemini, kafka)
│   │   ├── jobs/          # Cron jobs (cleanup.js)
│   │   ├── config/        # Environment variables, DB connection
│   │   └── index.js       # App entry point
│   │   └── package.json
│   │
│   ├── web/                 # Frontend Next.js App
│   │   ├── app/             # Next.js 14 App Router
│   │   │   ├── (main)/        # Main site layout
│   │   │   │   ├── jobs/
│   │   │   │   │   ├── [id]/page.tsx # Job detail page
│   │   │   │   │   └── page.tsx      # Job listing page
│   │   │   │   └── page.tsx          # Home page
│   │   │   ├── admin/       # Admin Panel (route-grouped)
│   │   │   │   └── login/
│   │   │   ├── api/         # Next.js API Routes (for BFF pattern if needed)
│   │   │   └── layout.tsx
│   │   ├── components/      # React components (Cards, Navbar, Modals)
│   │   ├── lib/             # Helper functions, API clients
│   │   ├── public/          # Static assets (robots.txt, images)
│   │   └── tailwind.config.js
│   │   └── package.json
│   │
│   └── services/            # Background worker services
│   │   └── notifications/   # Kafka consumer for Mailchimp
│   │       ├── index.js
│   │       └── package.json
│
├── .gitignore
├── package.json             # Root package.json with workspaces config
└── README.md
