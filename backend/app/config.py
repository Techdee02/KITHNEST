from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    database_url: str = 'postgresql+asyncpg://kithnest:kithnest@localhost:5433/kithnest'
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


settings = Settings()
