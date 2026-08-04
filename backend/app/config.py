from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    database_url: str = 'postgresql+asyncpg://kithnest:kithnest@localhost:5433/kithnest'

    # Deliberately independent of `database_url` — the app's DATABASE_URL can
    # point at a real, shared Supabase project, and the test suite must never
    # be able to touch that by inheriting it. Tests always run against local
    # Docker Postgres, full stop. See tests/conftest.py.
    test_database_url: str = 'postgresql+asyncpg://kithnest:kithnest@localhost:5433/kithnest_test'

    jwt_secret: str = 'dev-only-secret-change-me'
    jwt_algorithm: str = 'HS256'
    jwt_expires_minutes: int = 60 * 24 * 7  # 7 days
    frontend_origin: str = 'http://localhost:5173'
    upload_dir: str = 'uploads'

    # Left unset in local dev — storage.py falls back to LocalDiskStorage
    # when these are empty, and switches to SupabaseStorage automatically
    # once they're set (e.g. on Render). No code change needed to go live.
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    supabase_storage_bucket: str = 'school-logos'

    # AI insights + chat — Groq's OpenAI-compatible endpoint.
    groq_api_key: str | None = None
    groq_model: str = 'openai/gpt-oss-120b'

    # Voice summaries — YarnGPT (https://yarngpt.ai/api-docs).
    yarngpt_api_key: str | None = None


settings = Settings()
