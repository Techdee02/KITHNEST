import shutil
import tempfile

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
from app.storage import LocalDiskStorage
import app.routers.schools as schools_router

# Same problem as the database, one level up: app/storage.py picks its
# backend from SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY in .env, which now
# hold real credentials. Left alone, running tests would silently upload
# files to the real Supabase bucket (it did, once — cleaned up by hand).
# Force a throwaway local-disk backend for the whole test session instead,
# regardless of what's configured for the app itself.
_test_upload_dir = tempfile.mkdtemp(prefix='kithnest-test-uploads-')
schools_router.storage = LocalDiskStorage(base_dir=_test_upload_dir)

# Tests run against a dedicated LOCAL database — always, regardless of what
# DATABASE_URL the app itself is configured with. That setting can (and now
# does) point at a real, shared Supabase project; deriving the test DB from
# it was how an earlier version of this file once truncated real data.
# test_database_url is a fully separate setting for exactly this reason —
# see app/config.py. The assertion below is a second guard against ever
# accidentally pointing the test suite at a non-local database.
TEST_DATABASE_URL = settings.test_database_url
assert any(host in TEST_DATABASE_URL for host in ('localhost', '127.0.0.1')), (
    'Refusing to run tests against a non-local database. '
    'test_database_url must point at local Postgres — see app/config.py.'
)
_TEST_DB_NAME = TEST_DATABASE_URL.rsplit('/', 1)[-1]
_ADMIN_DATABASE_URL = TEST_DATABASE_URL.rsplit('/', 1)[0] + '/postgres'

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
    shutil.rmtree(_test_upload_dir, ignore_errors=True)


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
