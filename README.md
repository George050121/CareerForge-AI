# CareerForge AI

CareerForge is a portfolio-grade job-search command center. It compares a resume with a job description, produces an evidence-based fit strategy, and keeps an application pipeline in one focused workspace.

The project follows a documented enterprise delivery model. Start with the living [development process](docs/DEVELOPMENT_PROCESS.md), then review accepted changes under [`docs/rfcs`](docs/rfcs).

![CareerForge status](https://img.shields.io/badge/status-MVP-20231e) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Tests](https://img.shields.io/badge/tests-Vitest-dfff57)

## What it does

- Scores resume-to-role fit and explains the score
- Finds strengths, evidence gaps, and missing keywords
- Creates a targeted resume action plan and cover-letter draft
- Generates role-specific interview questions with answer strategies
- Tracks applications, statuses, dates, locations, and match quality
- Saves completed analyses directly into the pipeline
- Supports validated status transitions and confirmed record deletion
- Runs without credentials using a deterministic demo analyzer
- Uses OpenAI Structured Outputs when `OPENAI_API_KEY` is configured

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:8787`.

To enable model-backed analysis, add an API key to `.env`. Never expose that key in client code or commit the file.

```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.4-mini
```

## Engineering commands

```bash
npm run dev       # frontend + API with hot reload
npm run build     # strict TypeScript check and production bundle
npm test          # deterministic analyzer tests
npm run lint      # static analysis
npm start         # serve production build and API
```

## Architecture

```text
React + TypeScript UI
        │ /api
        ▼
Express API ── Zod validation
   │                    │
   ├── JSON repository  └── OpenAI Responses API
   └── demo analyzer        (Structured Outputs)
```

The API key remains server-side. Inputs are length-bounded and validated. AI output is checked twice: by JSON Schema at generation time and Zod at the application boundary. Every API response carries a request ID; write endpoints are schema-validated and local persistence uses atomic replacement. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for decisions and [docs/PLAN.md](docs/PLAN.md) for the roadmap.

## Data and privacy

Demo application data is seeded in code. New tracker records are written to `data/applications.json`, which is gitignored. Resume text is sent to OpenAI only when the server has an API key; otherwise analysis remains local.

## Current scope

This is a production-minded MVP, not a hosted multi-tenant service. Authentication, a managed database, document parsing, job-board ingestion, observability, and deployment automation are designed as follow-on milestones in the implementation plan.
