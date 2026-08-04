from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

    database_url: str = 'postgresql+asyncpg://kithnest:kithnest@localhost:5433/kithnest'
    jwt_secret: str = 'dev-only-secret-change-me'
    jwt_algorithm: str = 'HS256'
    jwt_expires_minutes: int = 60 * 24 * 7  # 7 days
    frontend_origin: str = 'http://localhost:5173'
    upload_dir: str = 'uploads'


settings = Settings()
