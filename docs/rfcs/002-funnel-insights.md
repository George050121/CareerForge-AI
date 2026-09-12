# RFC-002: Application Funnel Insights

- Status: Accepted
- Date: 2026-09-12
- Owners: Product & Engineering
- Target release: v1.2.0

## Context

CareerForge can capture and update applications, but users still see a flat list. They cannot quickly answer: where is the funnel blocked, which applications need follow-up, or how many applications have converted to interviews and offers. For a 10–30 role pipeline, this creates manual work and allows promising applications to go stale.

## Goals

1. Make pipeline health visible without exporting data.
2. Let users find a company/role and isolate a lifecycle stage quickly.
3. Surface active applications that have had no recorded movement for seven or more days.
4. Keep all analytics deterministic, explainable, and covered by unit tests.

## Non-goals

- Predicting hiring probability.
- External reminders, calendars, email, or job-board integrations.
- Historical event analytics; the current record has one `date`, so v1.2 treats it as the latest known activity date.
- Authentication or hosted multi-user storage.

## User acceptance criteria

1. Overview shows saved, applied, interview, and offer counts plus interview conversion.
2. Tracker supports case-insensitive company/role/location search and a status filter.
3. Tracker shows the result count and a useful empty state.
4. Active records seven or more days old are marked “Follow up”; terminal Offer/Rejected records are never marked stale.
5. Search and filters do not mutate or persist application data.

## Engineering acceptance criteria

1. Funnel, filtering, and stale logic live in a pure domain module.
2. Date calculations accept an injected `now` for deterministic tests.
3. Existing API and persistence contracts remain backward compatible.
4. CI, lint, tests, build, audit, smoke test, docs, and changelog pass before merge.

## UX decision

Use a compact funnel strip on Overview and an inline toolbar on Tracker. Avoid charts that imply statistical precision; exact counts and a simple conversion rate are more honest for small samples.

## Risks and mitigations

- **Date semantics:** Label the signal as “Follow up,” not “overdue”; document that `date` represents latest known activity until an event model ships.
- **Small-sample conversion:** Show `—` when there are no applied-or-later records rather than reporting a misleading 0%.
- **Filter discoverability:** Keep controls above the table with native labels and keyboard-accessible inputs.

## Rollout and rollback

- No schema or API migration. Rollout is a frontend/domain-only backward-compatible release.
- Rollback by reverting the v1.2.0 commit; stored application data is unaffected.
