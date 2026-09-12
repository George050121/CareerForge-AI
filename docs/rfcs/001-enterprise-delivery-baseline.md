# RFC-001: Enterprise Delivery Baseline

- Status: Accepted
- Date: 2026-09-11
- Owners: Product & Engineering
- Release: v1.1.0

## Context

The MVP proves the core matching experience, but write APIs trust arbitrary payloads, storage writes are non-atomic, operational errors are inconsistent, and analysis cannot enter the application pipeline. These gaps prevent a credible production-readiness story.

## Decision

Ship one vertical slice that connects AI analysis to pipeline management while establishing service-wide engineering controls.

### User acceptance criteria

1. A completed analysis can be saved as a tracked application without retyping company, role, or score.
2. A user can advance an application through Saved, Applied, Interview, Offer, and Rejected.
3. A user can remove a record with an explicit confirmation.
4. Failed actions show actionable feedback and do not leave optimistic UI in a false state.

### Engineering acceptance criteria

1. Every write payload is validated by Zod.
2. Every API response carries `X-Request-Id`; errors use `{ error: { code, message, requestId } }`.
3. Responses receive baseline security headers and API requests have an in-memory rate limit.
4. Persistence uses atomic replacement and exposes a testable repository factory.
5. CI runs lint, test, build, and a high-severity dependency audit.
6. Documentation includes process, ownership, risk, release, and rollback guidance.

## Alternatives considered

- **Immediate microservices:** rejected; organizational and scale boundaries do not justify distributed-system cost.
- **Immediate Postgres/auth:** deferred; correct next production milestone, but it requires hosting and identity decisions outside this local MVP.
- **Client-only persistence:** rejected; weakens the security boundary and makes future tenancy migration harder.

## Risks

- In-memory limits reset on restart and do not coordinate across replicas. Replace with Redis/gateway enforcement before horizontal scaling.
- JSON storage is single-process only. Atomic writes prevent partial files, not multi-process conflicts.
- Hard deletion is acceptable for local user data; hosted audit requirements may require tombstones and retention policy.

## Rollout and rollback

- Rollout: run all gates, smoke test CRUD and analysis, then push v1.1.0 to `main`.
- Rollback: revert the release commit. The stored application schema remains backward compatible, so no data rollback is required.
