# Developer Skill & GitHub/LeetCode Insights Hub

A full-stack developer analytics web app that aggregates public GitHub activity and LeetCode problem-solving stats into a unified profile, designed to highlight weak topic areas and generate personalized 30-day study plans.

## Current Progress & Features

- **LeetCode Ingestion (`src/lib/leetcode.ts`):** Queries LeetCode's GraphQL API for total solved problems, difficulty breakdowns (Easy, Medium, Hard), and topic-level solve counts.
- **GitHub Ingestion (`src/lib/github.ts`):** Uses Octokit to fetch public repository language byte distributions and recent push event commit activity.
- **Data Normalization (`src/lib/normalizer.ts`):** Combines GitHub and LeetCode data concurrently into a single typed `UnifiedDeveloperMetrics` payload with strong/weak topic insights.
- **In Progress / Planned:** PostgreSQL persistence via Prisma, GitHub authentication, AI roadmap generation, interactive Recharts visualizations, and deployment.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling & Visualization:** Tailwind CSS, Recharts (planned)
- **APIs & Data:** LeetCode GraphQL API, Octokit (GitHub REST API)
- **Database & ORM:** PostgreSQL (Supabase / Neon), Prisma
