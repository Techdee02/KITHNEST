from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import School, Update
from app.schemas import UpdateCreateRequest


async def get_school_by_code(db: AsyncSession, code: str) -> School:
    result = await db.execute(select(School).where(School.code == code.strip().upper()))
    school = result.scalar_one_or_none()
    if school is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="We couldn't find a school with that code. Double-check it and try again.",
        )
    return school


async def create_update(db: AsyncSession, school: School, payload: UpdateCreateRequest) -> Update:
    update = Update(
        school_id=school.id,
        title=payload.title.strip(),
        body=payload.body.strip(),
        category=payload.category,
        channel=payload.channel,
    )
    db.add(update)
    await db.commit()
    await db.refresh(update)
    return update


async def list_updates_for_school(db: AsyncSession, school_id) -> list[Update]:
    result = await db.execute(
        select(Update).where(Update.school_id == school_id).order_by(Update.created_at.desc())
    )
    return list(result.scalars().all())
