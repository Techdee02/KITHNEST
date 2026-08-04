from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_school
from app.models import School
from app.schemas import SchoolPublicResponse, UpdateCreateRequest, UpdateResponse
from app.services.update_service import create_update, get_school_by_code, list_updates_for_school

router = APIRouter(prefix='/schools', tags=['updates'])


@router.post('/me/updates', response_model=UpdateResponse, status_code=201)
async def post_update(
    payload: UpdateCreateRequest,
    current_school: School = Depends(get_current_school),
    db: AsyncSession = Depends(get_db),
):
    update = await create_update(db, current_school, payload)
    return UpdateResponse.model_validate(update)


@router.get('/lookup/{code}', response_model=SchoolPublicResponse)
async def lookup_school(code: str, db: AsyncSession = Depends(get_db)):
    school = await get_school_by_code(db, code)
    return SchoolPublicResponse.model_validate(school)


@router.get('/lookup/{code}/updates', response_model=list[UpdateResponse])
async def lookup_school_updates(code: str, db: AsyncSession = Depends(get_db)):
    school = await get_school_by_code(db, code)
    updates = await list_updates_for_school(db, school.id)
    return [UpdateResponse.model_validate(u) for u in updates]
