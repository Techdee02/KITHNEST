# Kithnest — 3-Phase Build Specification

**Product:** Kithnest — a parent-first Learning Management System for Kindergarten, Nursery, and Primary schools in Nigeria
**Prepared for:** Claude Code build handoff
**Prepared by:** Akeem Jr, Team 6 — Intellect Fellowship
**Model:** B2B SaaS — schools are paying customers, parents get free access through their school

---

## 0. Product Context (read this before building anything)

Kithnest is not another school administration tool. Every existing player (ClassDojo, Teachmint, Fedena, Toddle) builds for the teacher or the school office first and treats parents as an afterthought notification feed. Kithnest inverts that: **the parent is the primary user experience**, and the school is the customer who pays to give parents that experience.

The three pillars that every screen, flow, and feature should reinforce:

1. **Workload visualization** — a parent should be able to look at the app and immediately understand what their child is learning and what's due, without decoding a teacher's shorthand.
2. **Offline-first / low-bandwidth resilience** — Nigerian connectivity is inconsistent. Nothing critical should require a live connection to be *viewable* (it can require one to sync).
3. **SMS as a first-class channel, not a fallback** — a meaningful share of parents will never open the app. The product has to work for them too.

Design and build with these three as constraints, not features to bolt on later.

**Primary personas:**
- **Parent** — the daily user. Wants a fast, reassuring, low-friction check-in. Think "banking app," not "school portal."
- **School admin / proprietor** — the buyer. Wants to see engagement, upload content easily, and reduce the volume of one-off parent queries.
- **Teacher** (lighter-touch in early phases) — feeds content into the system; should never feel like extra admin work.

---

## Phase 1 — Frontend-Only Demo (Mocked, Looks Live)

### Goal
Produce a fully clickable, visually convincing frontend that **looks and feels like a live product** — real data flows, real transitions, real states (loading, empty, error) — but is backed entirely by mock/local data. No backend, no auth server, no database. This is the artifact used for pitching, fellowship demos, and early user/school feedback before any backend investment.

### What "looks live" means in practice
- Mock data should be realistic (real-sounding Nigerian school names, subjects, pupil names, dates), not "Lorem Ipsum" or "Student 1."
- Every interactive element should respond — buttons, tabs, filters — even if the underlying action is simulated with an in-memory state change or a fake delay.
- Include loading skeletons and micro-interactions so it doesn't feel like a static prototype.
- Local storage or in-memory state should persist actions *within a session* (e.g., marking a notification as read stays read until refresh) so demos feel responsive.

### Screens / Flows to build

**Parent-facing (primary focus):**
1. Onboarding / login screen — simple, assisted-setup feel (school code + phone number pattern, not a complex signup)
2. Parent Home Dashboard — child's snapshot: today's activities, upcoming tasks, recent school updates
3. Workload Visualization view — a clear, visual (not list-only) breakdown of what the child is learning this week and what's outstanding
4. Offline indicator/state — a visible "last synced" affordance and a mocked offline banner to demonstrate the concept, even though there's no real offline logic yet
5. Notifications / SMS-style updates feed — chronological feed of school communications
6. Child profile / progress view — basic academic snapshot (placeholder analytics chart is fine)

**School-facing (secondary, lighter-weight in Phase 1):**
7. School Management Portal login
8. Admin dashboard — mocked engagement metrics (e.g., "% of parents active this week"), upload/communication placeholder actions
9. Parent roster view — mocked list of connected parents per class

### Explicitly out of scope for Phase 1
- Real authentication or session management
- Any real SMS sending
- Real offline sync logic (only the *UI affordance* for it)
- Payment/subscription flows
- Multi-tenant data isolation

### Tech guidance for Claude Code
- Use a component-based frontend framework (React recommended) with mock data served from local JSON/fixtures, not a real API.
- Keep mock data in a clearly separated `/mocks` or `/fixtures` directory so Phase 2 can swap it for real API calls with minimal rewiring.
- Design mobile-first — most Nigerian parents will access this on a phone, often a mid-range Android device, so avoid heavy animations or large asset payloads.
- Componentize by persona (parent vs. school) so Phase 2 backend work can be scoped independently.

### Definition of done for Phase 1
- A stranger can walk through the parent journey (login → dashboard → workload view → notification) and the school journey (login → admin dashboard → roster) without hitting a dead end or obviously fake-looking screen.
- All states (loading, empty, populated, error) exist for at least the core dashboard views.
- Demo-ready on both desktop and mobile viewport.

---

## Phase 2 — Backend & Core Functionality

### Goal
Replace the mocked data layer with a real backend that supports actual schools, actual parents, and the actual data relationships between them. This is where Kithnest becomes a real product rather than a convincing sketch of one.

### Core functionality to build
1. **Authentication & accounts**
   - School admin accounts (the paying customer)
   - Parent accounts, linked to a school via school code / invite flow
   - Basic role-based access (admin vs. parent vs. teacher, if teacher accounts are in scope this phase)
2. **Data model foundations**
   - School → Classes → Pupils → Parents (many parents can map to one pupil; one parent can map to multiple pupils/schools if needed)
   - Workload/assignment entities — what a teacher/admin posts, tied to a class and a pupil group
   - Notification/communication entities — what gets pushed to parents
3. **Core parent experience, now real**
   - Live workload visualization pulled from actual posted data
   - Real notification feed (in-app; SMS integration can be a stub/queue in this phase, actual SMS delivery can land early Phase 3 if not already prioritized here)
4. **Core school experience, now real**
   - Admins can create classes, add pupils, invite parents, and post updates/workload items
   - Basic engagement metrics computed from real usage (not mocked)
5. **Offline-first data layer**
   - Implement actual local caching/sync so the app is genuinely usable with intermittent connectivity — this is a differentiator, not a nice-to-have, and should not be pushed entirely to Phase 3
6. **SMS integration (at least basic)**
   - Wire up an actual SMS provider for critical notifications, even if templates and packages are simplified for now

### Explicitly deferred to Phase 3
- Payment/subscription billing logic
- Advanced analytics and reporting
- White-label/custom branding
- Fee payment integrations
- AI-powered insights
- Multi-region/multi-country support

### Tech guidance for Claude Code
- Design the data model with multi-tenancy in mind from day one (school-scoped data isolation), even though Phase 1 didn't need it — retrofitting tenancy later is expensive.
- Prioritize the offline-sync architecture early in this phase since it's structurally harder to bolt on afterward than most other features.
- Keep the SMS provider behind an interface/abstraction so it can be swapped or expanded (premium packages, different providers) without touching core logic.
- Reuse Phase 1 components; swap the mock data layer for real API calls rather than rebuilding UI.

### Definition of done for Phase 2
- A real school can be onboarded, a real admin can add classes/pupils/parents, and a real parent can log in and see accurate, live data reflecting what the school posted.
- The app remains usable (read access to previously synced data) when connectivity drops.
- At least one category of notification reaches a parent via SMS, not just in-app.

---

## Phase 3 — Finishing Touches, Additional Features, Integrations

### Goal
Take the functionally complete product from Phase 2 and make it production-grade, differentiated, and ready for a real go-to-market push — matching everything promised in the board pitch brief's MVP-to-roadmap arc.

### Feature areas to build
1. **Billing & subscriptions** — Starter / Growth / Enterprise tiers, monthly/annual plans, school-side subscription management
2. **Advanced analytics & reporting** — for schools (engagement trends, class-level insights) and eventually parents (progress over time)
3. **Custom branding / white-label** — for schools/school groups who want their identity on the parent-facing app
4. **Digital fee payment integration** — since this was flagged as a natural extension of the parent relationship
5. **AI-powered learning insights** — surfaced to parents and schools, building on the real usage data now available from Phase 2
6. **Expanded SMS packages** — premium/large-scale notification tiers for bigger schools
7. **Teacher-parent direct communication tools** — deepening engagement beyond broadcast updates
8. **Polish pass** — performance tuning for low-end devices, accessibility, refined empty/error states, onboarding flow improvements based on Phase 1/2 pilot feedback

### Tech guidance for Claude Code
- Treat this phase as additive and modular — no core architecture changes should be required if Phase 2's data model and abstractions were built with this roadmap in mind.
- Payment integration should use a provider well-established in Nigeria (e.g., Paystack/Flutterwave-class providers) and be isolated behind a clear billing service boundary.
- AI insights should be built on top of the real data pipeline from Phase 2, not a separate parallel system.

### Definition of done for Phase 3
- A school can be signed up, billed, and supported end-to-end without manual intervention.
- The product matches the full feature set described in the Board Pitch Brief's MVP + roadmap sections.
- Ready for a real pilot rollout across the "10 schools" first-wave target.

---

## Cross-Phase Notes for Claude Code

- **Naming:** the product is called **Kithnest** throughout — use this consistently in code, copy, and documentation from Phase 1 onward.
- **Design language:** parent-first means the UI should feel closer to a consumer banking or messaging app than an enterprise school-management dashboard. Avoid dense admin-tool aesthetics on parent-facing screens.
- **Connectivity constraint:** always build assuming the user might be on 2G/3G with an older Android device — this affects asset sizes, animation choices, and how aggressively real-time features are used.
- **Don't over-build ahead of the phase.** Phase 1 should not sneak in real backend calls; Phase 2 should not sneak in billing logic. Keeping phases clean makes each one independently demoable and reviewable.
