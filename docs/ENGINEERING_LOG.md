# Engineering log

This append-only log records meaningful product and engineering updates. Each entry includes the decision, validation, and next risk so future work can resume without reconstructing context.

## 2026-09-12 — v1.2.0 application funnel insights

### Planned scope

- Accepted RFC-002 with explicit goals, non-goals, UX rationale, risks, acceptance criteria, and rollback plan.
- Added an explainable overview funnel and interview-conversion metric.
- Added tracker search, status filtering, result counts, empty-state handling, and seven-day follow-up signals.
- Isolated filtering, staleness, and funnel calculations in a deterministic domain module.
- Added domain tests and real HTTP integration coverage for request correlation, security headers, validation errors, and CRUD lifecycle.

### Validation

- ESLint: passed with zero warnings and errors.
- Automated tests: 15/15 passed across four suites, including pure domain and real HTTP integration coverage.
- Strict TypeScript and Vite production build: passed.
- Dependency audit: zero known vulnerabilities.
- Isolated production smoke test: SPA, static assets, and application API returned successfully.
- Visual/interaction check: funnel rendered with correct seed counts and search reduced 3 records to the expected single match.
- Git diff hygiene check: passed.

### Known constraints

- Follow-up age uses the application `date` as latest known activity. A future immutable status-event model is required for accurate stage-duration analytics.

## 2026-09-11 — v1.1.0 enterprise delivery baseline

### Shipped

- Established a living enterprise development process, RFC workflow, ownership rules, review template, bug intake, release record, and CI pipeline.
- Connected Match Lab output to the application pipeline with one-click save.
- Added validated lifecycle updates and confirmed deletion to the tracker.
- Introduced request IDs, structured API errors/logs, baseline security headers, payload bounds, and per-process rate limiting.
- Replaced direct JSON writes with serialized atomic replacement and a dependency-injectable repository.
- Expanded contract and repository tests, including invalid input and lifecycle behavior.

### Validation

- ESLint: passed with zero warnings and errors.
- Unit/contract tests: 8/8 passed across two suites.
- Strict TypeScript and Vite production build: passed.
- Dependency audit: zero known vulnerabilities.
- Isolated production smoke test: health/security headers, structured validation failure, create, status update, and delete all passed.
- Git diff hygiene check: passed.

### Known constraints

- The local JSON repository and in-memory limiter are single-process components; Postgres and distributed rate limiting remain required before horizontal production deployment.
- Bootstrap exception: RFC-001 establishes the PR gate itself and was self-reviewed by the repository owner workflow; subsequent feature changes must use the new pull-request template and CI gate.

## 2026-09-07 — v0.1.0 foundation and MVP

### Shipped

- Defined the CareerForge product thesis, target user, MVP acceptance criteria, and five-milestone roadmap.
- Created a strict TypeScript modular monolith with React, Vite, and Express.
- Built the responsive overview dashboard, application tracker, and AI Match Lab.
- Added resume/job validation, deterministic offline analysis, OpenAI Responses API integration, strict structured output, and secondary Zod validation.
- Added a JSON-backed application repository with seeded demo data and gitignored user records.
- Added unit coverage for validation, scoring bounds, provider-free repeatability, and missing-keyword detection.
- Documented architecture decisions, privacy boundaries, local setup, risk register, and production backlog.

### Validation

- Unit suite: 3 tests passing.
- ESLint: zero warnings and zero errors.
- Strict TypeScript and Vite production build: passing.
- Dependency audit: zero known vulnerabilities at installation time.
- Production smoke test: health endpoint, application API, and SPA shell all returned successfully.

### Next engineering priorities

1. Replace JSON persistence with Postgres and authenticated tenancy.
2. Add an AI evaluation dataset and recruiter-scored regression suite.
3. Add document import, observability, rate limiting, and CI deployment gates.

### Known constraints

- No GitHub CLI was present in the build environment at project initialization.
- Live AI behavior requires the operator’s own `OPENAI_API_KEY`; offline demo behavior requires no secret.
