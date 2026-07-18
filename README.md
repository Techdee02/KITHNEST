# Kithnest — Phase 1 (Frontend Demo)

A parent-first Learning Management System for Kindergarten, Nursery, and Primary schools in
Nigeria. This is **Phase 1**: a fully clickable frontend demo backed entirely by mock data — no
backend, no real auth, no real SMS. See `docs/Kithnest_3_Phase_Build_Spec.md` and
`docs/Kithnest_Phase1_ClaudeCode_Prompt.md` for the full product brief.

## Stack

Vite + React + TypeScript, Tailwind CSS v4 (design tokens in `src/index.css`), React Router,
Framer Motion. No UI component library — everything in `src/design-system` is hand-built so the
visual identity doesn't inherit a library default.

## Running it

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## Structure

- `src/design-system` — tokens, Button/Card/Badge/Icon/etc. primitives shared by both personas
- `src/features/parent` — onboarding, dashboard, workload, notifications, profile
- `src/features/school` — portal login, admin dashboard, parent roster
- `src/fixtures` — mock schools/classes/pupils/parents/workload/notifications data
- `src/lib` — `fakeFetch` (simulated latency), localStorage-backed state, small formatters

## Demo credentials

Both login screens are pre-filled with working demo credentials — school code `BKL204`, plus a
phone number (parent) or password (school admin). Clear a field and submit to see the error
state.

## Image placeholders

Screens that need real photography ship with a clearly labeled dashed-border placeholder (see
`src/design-system/components/ImagePlaceholder.tsx`) describing exactly what to shoot. Swap in
real assets as they're supplied — no code changes needed beyond replacing the placeholder with an
`<img>`.
