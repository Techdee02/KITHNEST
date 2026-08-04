from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=False,
    # Disables asyncpg's client-side prepared-statement cache. Harmless
    # against a plain Postgres connection (local dev); required against
    # Supabase's connection pooler (PgBouncer, transaction mode), which
    # doesn't support prepared statements persisting across queries.
    connect_args={'statement_cache_size': 0},
)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
