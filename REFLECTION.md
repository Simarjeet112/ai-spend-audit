# Reflection

## 1. The hardest bug I hit this week

The hardest bug was the Prisma 7 breaking change during deployment. Locally everything worked fine but on Render the build kept failing. The error was `The datasource property url is no longer supported in schema files` — I had never seen this before and the message was not intuitive.

My first hypothesis was that my schema syntax was wrong. I tried different ways of writing the datasource block. None worked. Then I read the Prisma 7 migration guide and realized this was an intentional breaking change — Prisma 7 moved database URL configuration to a separate prisma.config.ts file. The fix was downgrading to Prisma 5 which uses the standard url field approach that all documentation and tutorials assume.

The lesson was specific: when an error says a property is no longer supported, check the changelog before assuming your code is wrong. The code was correct — the library had moved.

## 2. A decision I reversed mid-week

I initially planned to use Next.js API routes for the backend instead of a separate Express server. The reasoning was simplicity — one deployment, one repo, no CORS to configure.

I reversed this after thinking through testability. The audit engine is the core business logic of the product. If it lives inside Next.js server actions, testing it requires spinning up a Next.js environment. If it lives in a separate Express service, the audit engine is a pure TypeScript function with no framework dependencies — I can test it with Vitest by just importing it directly.

This decision also future-proofs the product. A separate API can be consumed by a mobile app, an embeddable widget, or a CLI tool without touching the frontend. The CORS configuration cost was worth the architectural flexibility.

## 3. What I would build in week 2

First priority is the embeddable widget — a script tag that any blogger or newsletter writer can drop into their content to add an interactive audit tool. Every embed is a distribution channel that costs nothing to maintain and compounds over time.

Second priority is authentication with Clerk so users can save multiple audits and track their spend over time. The current localStorage history is limited to one browser. A logged-in user can see their audit history across devices and share a dashboard with their team.

Third priority is a Slack integration. Most engineering teams already have a tools or spending channel. If the audit report lands in Slack automatically, the decision-maker sees it without the user having to forward it manually. That removes a friction point in the conversion from audit to action.

## 4. How I used AI tools

I used Claude as a senior engineer mentor throughout the build. Specific tasks: scaffolding the monorepo structure, debugging TypeScript and deployment errors, generating the Three.js animation code, writing Express middleware, and drafting documentation.

I did not trust Claude with pricing data — I verified every number myself against official vendor pricing pages and cited the URLs in PRICING_DATA.md. I also rewrote the GTM strategy after Claude's first draft was too generic. It said post on Twitter and do SEO. I pushed back and asked for specific subreddits, Slack communities, and realistic conversion rates.

One specific time Claude was wrong: it suggested using THREE.Clock directly in the React Three Fiber animation loop. This caused deprecation warnings in the browser console. The correct approach inside useFrame is state.clock.getElapsedTime() which uses the R3F managed clock rather than creating a new one. I caught this by reading the DevTools console warnings instead of ignoring them.

## 5. Self-ratings

**Discipline: 6/10** — Most of the build happened in two intensive days rather than spread across seven. The git history is honest about this. I should have started earlier instead of letting the deadline drive the schedule.

**Code quality: 7/10** — Separation of concerns is clean across routes, controllers, and services. TypeScript is strict throughout. The audit engine is independently testable. Loses points for not having integration tests and for some React components being longer than ideal.

**Design sense: 8/10** — The Three.js backgrounds and Framer Motion animations elevate the UI significantly. The dark zinc and blue color system is consistent and intentional. Loses a point for not running a full Lighthouse audit before submission.

**Problem solving: 8/10** — Debugged the Prisma version issue, the CORS deployment problem, and the TypeScript build errors by reading error messages carefully and forming specific hypotheses rather than random guessing.

**Entrepreneurial thinking: 7/10** — The GTM and economics documents show real product thinking with specific numbers. Loses points for conducting user interviews on deadline day rather than day one — those conversations should have shaped the design, not confirmed it.