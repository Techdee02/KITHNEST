# Kithnest backend

FastAPI + Postgres, currently covering **school registration/login and
school-wide updates** (Phase 2, first two slices). Parent accounts, pupils,
classes, and workload are still served from the frontend's Phase 1 fixtures —
parents currently link to a real school by code and see that school's real
posted updates, nothing else yet. See the root `docs/` for the full phased plan.

## Why plain Postgres locally, when the stack is "Supabase"?

A Supabase project is a managed Postgres database, optionally paired with its
own Auth/Storage services. Running the full Supabase CLI stack locally (~10
containers: Postgres, GoTrue, PostgREST, Storage API, Kong, Studio...) is heavy
for day-to-day dev. Since a Supabase project is Postgres underneath, this repo
develops against a single plain Postgres container and has FastAPI own auth
directly (bcrypt + JWT) instead of delegating to GoTrue. Going live later means
pointing `DATABASE_URL` at the real Supabase Postgres connection string — no
application code changes. Logo storage is behind a `StorageBackend` interface
(`app/storage.py`) for the same reason: `LocalDiskStorage` today, a
`SupabaseStorage` implementation swapped in later.

## Running it

```bash
docker compose up -d              # starts Postgres on localhost:5433
cp .env.example .env              # then edit if needed
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head              # creates the schools/updates tables
uvicorn app.main:app --reload --port 8000
```

The API is served at `http://localhost:8000/api`. Interactive docs at
`http://localhost:8000/docs`.

## Tests

```bash
source .venv/bin/activate
pytest -v
```

Tests run against a **separate `kithnest_test` database**, created
automatically on first run — never the `kithnest` database you're actually
using to click through the app. (An earlier version of this suite truncated
the shared dev database between tests and once wiped out a real,
manually-created account — don't reintroduce that.)

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/schools/register` | — | Create a school + admin account |
| POST | `/api/schools/login` | — | Get a session token |
| GET | `/api/schools/me` | Bearer | Current school's profile |
| POST | `/api/schools/me/logo` | Bearer | Upload/replace the school's logo |
| POST | `/api/schools/me/updates` | Bearer | Post an update (visible to parents) |
| GET | `/api/schools/lookup/{code}` | — | Public school profile, by school code |
| GET | `/api/schools/lookup/{code}/updates` | — | Public list of a school's updates, by code |
