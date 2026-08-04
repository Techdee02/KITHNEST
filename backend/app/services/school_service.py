import random
import re

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import School
from app.schemas import SchoolLoginRequest, SchoolRegisterRequest
from app.security import hash_password, verify_password


def _code_prefix(name: str) -> str:
    words = re.findall(r'[A-Za-z]+', name)
    letters = ''.join(w[0] for w in words).upper()
    if len(letters) < 3:
        letters = (letters + re.sub(r'[^A-Za-z]', '', name).upper())[:3]
    return (letters[:4] or 'SCH').ljust(3, 'X')


async def generate_unique_school_code(db: AsyncSession, name: str) -> str:
    prefix = _code_prefix(name)
    for _ in range(20):
        candidate = f'{prefix}{random.randint(100, 999)}'
        existing = await db.execute(select(School.id).where(School.code == candidate))
        if existing.scalar_one_or_none() is None:
            return candidate
    raise RuntimeError('Could not generate a unique school code after 20 attempts.')


async def register_school(db: AsyncSession, payload: SchoolRegisterRequest) -> School:
    existing = await db.execute(select(School).where(School.admin_email == payload.admin_email.lower()))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='An account with that email already exists. Try logging in instead.',
        )

    code = await generate_unique_school_code(db, payload.name)

    school = School(
        name=payload.name.strip(),
        short_name=payload.short_name.strip(),
        code=code,
        location=payload.location.strip(),
        motto=payload.motto.strip() if payload.motto else None,
        admin_name=payload.admin_name.strip(),
        admin_email=payload.admin_email.lower(),
        password_hash=hash_password(payload.password),
    )
    db.add(school)
    await db.commit()
    await db.refresh(school)
    return school


async def authenticate_school(db: AsyncSession, payload: SchoolLoginRequest) -> School:
    result = await db.execute(select(School).where(School.admin_email == payload.admin_email.lower()))
    school = result.scalar_one_or_none()

    if school is None or not verify_password(payload.password, school.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password.',
        )
    return school
