# Architecture decisions

## ADR-001: modular monolith for the MVP

**Decision:** React client and Express API in one TypeScript repository.

**Why:** One deployment unit minimizes operational cost while preserving a real trust boundary around secrets and persistence. Services can be extracted after load or team ownership justifies them.

## ADR-002: structured AI output

**Decision:** Request strict JSON Schema output and validate it again with Zod.

**Why:** UI rendering requires stable fields. Prompt-only JSON is too brittle, and downstream validation gives a defensive boundary if provider behavior or schemas change.

## ADR-003: useful offline mode

**Decision:** Use a deterministic lexical comparison when no API key exists.

**Why:** Recruiters and contributors can evaluate the complete flow immediately. It also creates a stable baseline for tests and graceful degradation.

## ADR-004: repository-isolated local persistence

**Decision:** Store MVP applications in a gitignored JSON file behind `server/store.ts`.

**Why:** It avoids infrastructure during local evaluation. The narrow module is intentionally replaceable by a Postgres repository in the next milestone.

## ADR-005: pure client-side insights domain

**Decision:** Filtering, follow-up age, and small-sample funnel calculations live in `src/domain/applications.ts` as pure functions.

**Why:** These insights derive entirely from the already-loaded pipeline, so an additional API would add latency and coupling without improving authority. Injected time makes follow-up rules deterministic in tests. A future historical event model can replace this calculation without changing presentation components.

## API contracts

- `GET /api/health` — process readiness and AI configuration flag
- `GET /api/applications` — ordered pipeline records
- `POST /api/applications` — create a pipeline record
- `PATCH /api/applications/:id` — transition application status
- `DELETE /api/applications/:id` — remove a pipeline record
- `POST /api/analyze` — validated resume and job analysis

## Security posture

Provider secrets are read only by the server. Request bodies are capped at 1 MB and domain inputs at 30,000 characters. `.env` and user-created records are excluded from source control. Baseline security headers, request correlation, structured errors, and single-process rate limiting are enabled. Before public hosting, add authentication, per-user authorization, distributed rate limiting, encrypted managed storage, CSRF strategy, and retention controls.
