# CareerForge product and implementation plan

## 1. Product thesis

Job seekers do not need more generic text generation. They need a repeatable operating system that turns a role into a decision: **Should I apply? What evidence should I emphasize? What must I prepare? What happens next?** CareerForge keeps that loop in one place.

## 2. Target user and outcome

The primary user is an early-to-mid-career software engineer managing 10–30 targeted applications. Success means spending less time on low-fit roles, producing more specific applications, and arriving at interviews with an evidence-backed story.

## 3. MVP requirements

| Area | Requirement | Acceptance signal |
|---|---|---|
| Match Lab | Compare resume and job description | Returns a 0–100 score plus rationale |
| Grounding | Never invent candidate experience | Advice is framed as gaps/actions, not fake claims |
| Documents | Draft tailored materials | Resume actions and cover letter are copyable |
| Interview | Prepare likely questions | Each question includes an answer strategy |
| Pipeline | Track applications | Roles and statuses are visible in a single table |
| Resilience | Useful without an API key | Deterministic local analysis works immediately |
| Safety | Keep credentials server-side | Browser never receives the provider key |

## 4. System design

The UI is a Vite-built React SPA. An Express boundary owns validation, persistence, provider calls, and production static serving. Zod protects runtime boundaries. The OpenAI adapter requests strict JSON Schema output; a deterministic lexical analyzer provides an offline fallback. Local JSON storage deliberately keeps the first-run experience simple while isolating persistence behind a repository module.

## 5. Delivery milestones

### Milestone 1 — foundation (complete)

- Product brief, visual system, TypeScript workspace, API skeleton
- Responsive dashboard and seeded pipeline
- Health endpoint and local persistence

### Milestone 2 — intelligence loop (complete)

- Validated resume/job intake
- Fit score, strengths, gaps, keywords, resume actions
- Cover letter and interview preparation
- OpenAI Structured Outputs adapter and demo fallback

### Milestone 3 — production hardening (next)

- Postgres with migrations; repository contract tests
- Auth with email/social login and per-user tenancy
- Encrypted resume storage, deletion controls, audit events
- Rate limits, request IDs, structured logs, error monitoring
- Background work queue for long analyses

### Milestone 4 — acquisition workflow

- PDF/DOCX resume parsing and multiple resume versions
- Browser extension or bookmarklet to capture job posts
- Job freshness and duplicate detection
- Calendar reminders and follow-up nudges

### Milestone 5 — measurable outcomes

- Funnel analytics: saved → applied → interview → offer (v1 delivered; historical event model remains)
- Resume version experiments and response-rate comparisons
- Prompt/evaluation dataset with recruiter-scored outputs
- Accessibility audit, performance budgets, end-to-end tests

## 6. Quality strategy

- Unit tests cover deterministic domain behavior and validation.
- Build runs strict TypeScript across client and server.
- AI evaluation set should include sparse resumes, career changes, senior roles, and adversarial job text.
- Human rubric: faithfulness, specificity, actionability, tone, and prohibited fabrication.
- Deployment gate: lint, unit tests, build, dependency audit, smoke test.

## 7. Risks and mitigations

- **Hallucinated experience:** prompts prohibit invention; output language is reviewed and evaluation cases test grounding.
- **Sensitive personal data:** local mode is default without a key; future hosted versions need encryption and deletion controls.
- **Misleading score precision:** verdict and evidence accompany the score; it is positioning guidance, not a hiring probability.
- **Keyword gaming:** recommendations prioritize demonstrated evidence and natural language, not stuffing.
- **Vendor coupling:** AI access is isolated in `server/analyzer.ts` and the app retains a provider-free path.

## 8. Definition of done for MVP

Fresh clone installs, tests, lints, builds, and launches from documented commands; the complete analysis journey works without secrets; provider credentials never reach the client; architectural decisions and every delivery update are recorded.
