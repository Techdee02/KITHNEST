# Prompt for Claude Code: Build Kithnest — Phase 1 (Frontend Demo)

You are building **Kithnest**, a parent-first Learning Management System for Kindergarten, Nursery, and Primary schools in Nigeria. This is **Phase 1 of a 3-phase build**: a frontend-only demo that must look and feel like a real, live product — but is backed entirely by mock data. No backend, no real auth, no database. The goal is a clickable, convincing artifact for pitching, fellowship demos, and early feedback.

## Product framing

Every existing competitor (ClassDojo, Teachmint, Fedena, Toddle) is built for teachers and school admins first, with parents as an afterthought. Kithnest inverts that: **the parent is the primary user**, and the school is the customer paying to give parents this experience. Design and build accordingly — the parent-facing experience should feel like a consumer app (think banking or messaging apps that people check daily), not an enterprise dashboard.

Three product pillars every screen should reinforce:
1. **Workload visualization** — parents instantly understand what their child is learning and what's due.
2. **Offline resilience** (visual affordance only in Phase 1 — no real offline logic yet).
3. **SMS as first-class**, not a fallback — represented visually even though nothing is actually sent yet.

## Design direction — this needs to look intentional, not templated

Do not default to generic SaaS-dashboard patterns (white cards, blue accent, Inter font, stock icon set). This has to look like real design effort went into it. Apply these principles:

- **Human over polished.** Avoid the "too-perfect, too-generated" look — audiences increasingly read flawless, symmetric, stock-photo-heavy design as low-effort or AI-made. Favor slightly textured backgrounds, warm imperfect photography (see image sourcing below), and a tone that feels like real humans built this for real families — not a corporate template.
- **Be intentional.** Every color, spacing choice, and component should feel like a deliberate decision tied to the product's identity (warmth, trust, connection between home and school) — not a default from a component library.
- **Design emotionally aware.** This product sits at the intersection of parenting and education — the emotional register is warmth, reassurance, and pride in a child's progress, not corporate efficiency. Let that show in copy tone, color choice, and how progress/achievement moments are presented.
- **Use motion deliberately.** Small, purposeful transitions and micro-interactions (card reveals, progress-bar fills, gentle state changes) aid comprehension and retention — but should never feel gratuitous or slow the user down.
- **Build a real visual identity**, not a component-library default: pick a distinct color palette (I'd lean toward warm, optimistic tones rather than generic corporate blue — but use your judgment and show me options if you want feedback), a typography pairing with actual character, and a consistent icon/illustration style. Establish this as a small design-tokens file (colors, spacing, type scale) before building screens, and use it consistently throughout — I want it to be obvious a real design system was thought through, not that each screen was styled independently.

**Reference material:** I'll be sending you Cardtonic's 2026 Design Trends Report as a style/philosophy reference — treat its "human, intentional, emotionally aware" framing as design direction for Kithnest, not as a literal brand template to copy (Kithnest needs its own identity, in an education/parenting register rather than fintech). If I send you the actual PDF separately, use its specific visual examples for texture/composition inspiration.

## Real images — ask me, don't fabricate

I want real, authentic photography in this build, not generic stock-photo-looking illustrations or obviously AI-generated faces, to reinforce the "human" design principle above.

**As you build each screen that needs imagery** (hero sections, parent dashboard illustrations, empty states, any place a photo of a child, classroom, or parent would appear), do the following:
1. Build the screen with a clearly labeled placeholder in that exact spot (sized and positioned correctly, ideally with a subtle "image placeholder" visual treatment so it's obvious it's temporary).
2. **Stop and ask me** what specific image you need for that spot (e.g., "I need a photo of a Nigerian classroom for the hero section — warm, natural lighting, kids engaged in an activity") — be specific about the mood/subject/composition you need so I can source or generate the right one.
3. I'll fetch or provide the image while you continue building other parts.
4. When I hand you the image, drop it into that placeholder and continue.

Don't block the entire build waiting on images — keep working on layout, interactions, and other screens while image requests are pending, and swap them in as they arrive.

## Screens to build (Phase 1 scope)

**Parent-facing (primary focus — spend the most design effort here):**
1. Onboarding/login — school code + phone number pattern, simple and reassuring
2. Parent Home Dashboard — child's snapshot: today's activities, upcoming tasks, recent updates
3. Workload Visualization view — visual (not list-only) breakdown of what the child is learning this week and what's outstanding
4. Offline state affordance — "last synced" indicator and an offline banner concept (visual only)
5. Notifications/updates feed — chronological school communications
6. Child profile/progress view — basic academic snapshot with a placeholder progress visualization

**School-facing (secondary, lighter design effort):**
7. School Management Portal login
8. Admin dashboard — mocked engagement metrics, upload/communication placeholder actions
9. Parent roster view — mocked list of connected parents per class

## Mock data requirements
- Use realistic Nigerian school names, subjects, and pupil names — not "Lorem Ipsum" or "Student 1."
- Every interactive element (buttons, tabs, filters) should respond, even if the action is simulated with in-memory state.
- Build loading skeletons and empty states, not just the happy path.
- In-session state should persist (e.g., a read notification stays read until refresh).

## Explicitly out of scope for this phase
- Real authentication or backend calls
- Actual SMS sending
- Real offline sync logic
- Payments or billing
- Multi-tenant data isolation

## Technical notes
- Component-based frontend (React), mobile-first — most parents will use this on a mid-range Android phone, so keep asset sizes and animation weight reasonable.
- Keep mock data in a clearly separated fixtures/mocks directory so it can be swapped for real API calls in Phase 2 with minimal rewiring.
- Componentize by persona (parent vs. school) so backend work in Phase 2 can be scoped independently per persona.

## Definition of done
A stranger can walk through the full parent journey (login → dashboard → workload view → notifications) and the school journey (login → admin dashboard → roster) without hitting a dead end or a screen that looks obviously unfinished or fake. The design should look like a funded, thoughtfully-built product — not a wireframe or a hackathon prototype.
