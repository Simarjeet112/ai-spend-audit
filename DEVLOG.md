# Devlog

## Day 1 — 2026-05-09

**Hours worked:** 6

**What I did:** Set up the monorepo with pnpm workspaces. Scaffolded Next.js 16 frontend and Express backend. Initialized Prisma schema with 3 tables — AuditReport, Subscription, Lead. Connected to Neon PostgreSQL and pushed the schema. Got the health endpoint working and tested it with curl.

**What I learned:** pnpm workspaces require Node 22+. Hit a version mismatch error — my system was on Node 20 which caused pnpm to crash with a missing built-in module error. Also learned that Prisma 7 changed how DATABASE_URL is configured and had to downgrade to Prisma 5.

**Blockers:** Node version issue with pnpm took 45 minutes to debug. Prisma 7 breaking changes were not obvious from the error message.

**Plan for tomorrow:** Build the audit engine logic and wire up the POST /api/audit endpoint end to end.

## Day 2 — 2026-05-10

**Hours worked:** 9

**What I did:** Built the complete audit engine with deterministic rules for 10+ AI tools. Created all Express API routes — audit, report, summary, leads, stats. Added Zod validation on all endpoints. Built the entire Next.js frontend — landing page with Three.js particle field, 3-step audit form, results dashboard with savings chart and before/after comparison toggle. Deployed frontend to Vercel and backend to Render. Fixed CORS errors after deployment.

**What I learned:** Three.js must be loaded client-side only in Next.js using dynamic imports with ssr:false. CORS errors taught me to configure allowed origins properly. Render deployment failed because root directory was set to api instead of apps/api — small config detail that cost 30 minutes.

**Blockers:** TypeScript build errors on Render that didn't appear locally because tsx watch is more lenient than tsc. Had to fix explicit type annotations on the stats controller.

**Plan for tomorrow:** Security hardening, more features, start documentation.

## Day 3 — 2026-05-11

**Hours worked:** 5

**What I did:** Added form state persistence to localStorage so users don't lose work on page reload. Added Credex CTA for audits showing more than $500 savings. Added honeypot field to email form for bot protection. Wrote TESTS.md, PROMPTS.md, and PRICING_DATA.md with verified pricing sources from official vendor pages.

**What I learned:** Honeypot fields need display none and tabIndex -1 to be invisible to real users but detectable when bots fill them. Always wrap localStorage in try/catch — it throws in some browser security contexts.

**Blockers:** Heredoc commands in terminal kept failing when file content contained the EOF delimiter. Switched to creating files directly in VS Code.

**Plan for tomorrow:** Architecture and business documentation.

## Day 4 — 2026-05-12

**Hours worked:** 5

**What I did:** Wrote ARCHITECTURE.md with a Mermaid system diagram and detailed reasoning for each stack decision. Wrote GTM.md with specific channels, realistic conversion rates, and a 30-day zero-budget acquisition plan. Wrote ECONOMICS.md with unit economics and path to $1M ARR. Wrote LANDING_COPY.md and METRICS.md.

**What I learned:** Writing the GTM forced me to get specific about who the user actually is. The answer is not startups generally — it is the engineering manager or CTO at a 5-50 person company who controls both tool decisions and budget. That specificity changes the copy and the channels.

**Blockers:** None significant.

**Plan for tomorrow:** User interviews, DEVLOG, REFLECTION, USER_INTERVIEWS. Final submission.

## Day 5 — 2026-05-13

**Hours worked:** 4

**What I did:** Conducted 3 user interviews with founders and people using AI tools professionally. Wrote REFLECTION.md and USER_INTERVIEWS.md. Updated README with screenshots. Final build check and submission.

**What I learned:** Every person I spoke to knew roughly what they paid but had never compared it against what they actually needed. One person was surprised to learn ChatGPT Team costs $25/seat — they assumed it was the same as Plus. The pain is real and the awareness gap is real.

**Blockers:** Deadline pressure meant bonus features had to be cut. Prioritized all required files over PDF export and embeddable widget.

**Plan for tomorrow:** Submit and focus on next assignment.