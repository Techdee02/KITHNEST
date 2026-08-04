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
(`app/storage.py`): `LocalDiskStorage` is used automatically in local dev;
`SupabaseStorage` (implemented, uploads via the Storage REST API) is used
automatically once `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set —
see `.env.example`. No code change either way.

## Deploying for real (Render + Supabase)

1. **Supabase**: create a project, then use its **connection pooler** string
   (Settings → Database → Connection Pooling, port 6543) as `DATABASE_URL`,
   scheme changed to `postgresql+asyncpg://`. Run `alembic upgrade head`
   once, pointed at that URL, to create the tables. Create a **public**
   Storage bucket named `school-logos` (Storage → New bucket) — this repo
   never creates the bucket itself.
2. **Render**: New Web Service → this repo, **Root Directory** `backend`,
   Build Command `pip install -r requirements.txt`, Start Command
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, health check path
   `/api/health`. Set `DATABASE_URL`, a real random `JWT_SECRET`,
   `FRONTEND_ORIGIN` (wherever the frontend is deployed), `SUPABASE_URL`,
   and `SUPABASE_SERVICE_ROLE_KEY` (from Supabase Settings → API — the
   `service_role` key, not the `anon` one) as environment variables.

Render's disk is ephemeral, which is exactly why logo uploads need
`SupabaseStorage` rather than `LocalDiskStorage` in production — a file
written to Render's local disk disappears on the next deploy.

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
