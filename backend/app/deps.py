from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import School
from app.security import InvalidTokenError, decode_access_token

bearer_scheme = HTTPBearer()


async def get_current_school(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> School:
    try:
        school_id = decode_access_token(credentials.credentials)
    except InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Your session has expired. Please log in again.',
        ) from exc

    result = await db.execute(select(School).where(School.id == school_id))
    school = result.scalar_one_or_none()
    if school is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='School not found.')
    return school
