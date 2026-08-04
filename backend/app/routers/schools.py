from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_school
from app.models import School
from app.schemas import SchoolLoginRequest, SchoolRegisterRequest, SchoolResponse, TokenResponse
from app.security import create_access_token
from app.services.school_service import authenticate_school, register_school
from app.storage import storage

router = APIRouter(prefix='/schools', tags=['schools'])


@router.post('/register', response_model=TokenResponse, status_code=201)
async def register(payload: SchoolRegisterRequest, db: AsyncSession = Depends(get_db)):
    school = await register_school(db, payload)
    token = create_access_token(school.id)
    return TokenResponse(school=SchoolResponse.model_validate(school), access_token=token)


@router.post('/login', response_model=TokenResponse)
async def login(payload: SchoolLoginRequest, db: AsyncSession = Depends(get_db)):
    school = await authenticate_school(db, payload)
    token = create_access_token(school.id)
    return TokenResponse(school=SchoolResponse.model_validate(school), access_token=token)


@router.get('/me', response_model=SchoolResponse)
async def me(current_school: School = Depends(get_current_school)):
    return SchoolResponse.model_validate(current_school)


@router.post('/me/logo', response_model=SchoolResponse)
async def upload_logo(
    file: UploadFile = File(...),
    current_school: School = Depends(get_current_school),
    db: AsyncSession = Depends(get_db),
):
    logo_url = await storage.save(file, folder='logos')
    current_school.logo_url = logo_url
    db.add(current_school)
    await db.commit()
    await db.refresh(current_school)
    return SchoolResponse.model_validate(current_school)
