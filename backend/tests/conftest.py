import asyncpg
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.config import settings
from app.database import Base, get_db
from app.main import app
from app import models  # noqa: F401  registers models on Base.metadata

# Tests run against a SEPARATE database from local dev — never the one you're
# actually using to click through the app. (An earlier version of this file
# truncated the shared dev database between tests, which once wiped out a
# real, manually-created account. Not doing that again.)
_TEST_DB_NAME = 'kithnest_test'
TEST_DATABASE_URL = settings.database_url.rsplit('/', 1)[0] + f'/{_TEST_DB_NAME}'
_ADMIN_DATABASE_URL = settings.database_url.rsplit('/', 1)[0] + '/postgres'

test_engine = create_async_engine(TEST_DATABASE_URL, poolclass=NullPool)
TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)


async def _override_get_db():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = _override_get_db


def _asyncpg_dsn(url: str) -> str:
    return url.replace('postgresql+asyncpg://', 'postgresql://')


@pytest_asyncio.fixture(scope='session', autouse=True, loop_scope='session')
async def _test_database():
    conn = await asyncpg.connect(_asyncpg_dsn(_ADMIN_DATABASE_URL))
    try:
        exists = await conn.fetchval('SELECT 1 FROM pg_database WHERE datname = $1', _TEST_DB_NAME)
        if not exists:
            await conn.execute(f'CREATE DATABASE {_TEST_DB_NAME}')
    finally:
        await conn.close()

    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    yield
    await test_engine.dispose()


@pytest_asyncio.fixture(autouse=True)
async def _clean_tables(_test_database):
    async with test_engine.begin() as conn:
        await conn.execute(text('TRUNCATE TABLE schools CASCADE'))
    yield


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url='http://test') as ac:
        yield ac


@pytest.fixture
def school_payload():
    return {
        'name': 'Bright Kids Nursery & Primary School',
        'short_name': 'Bright Kids',
        'location': 'Lekki Phase 1, Lagos',
        'motto': 'Nurturing Curious Minds',
        'admin_name': 'Amaka Adeyemi',
        'admin_email': 'amaka@brightkidsnursery.ng',
        'password': 'super-secret-1',
    }
