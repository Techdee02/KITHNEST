import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SchoolRegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    short_name: str = Field(min_length=2, max_length=100)
    location: str = Field(min_length=2, max_length=200)
    motto: str | None = Field(default=None, max_length=200)
    admin_name: str = Field(min_length=2, max_length=150)
    admin_email: EmailStr
    password: str = Field(min_length=8, max_length=100)


class SchoolLoginRequest(BaseModel):
    admin_email: EmailStr
    password: str


class SchoolResponse(BaseModel):
    id: uuid.UUID
    name: str
    short_name: str
    code: str
    location: str
    motto: str | None
    admin_name: str
    admin_email: str
    logo_url: str | None
    created_at: datetime

    model_config = {'from_attributes': True}


class TokenResponse(BaseModel):
    school: SchoolResponse
    access_token: str
    token_type: str = 'bearer'


class SchoolPublicResponse(BaseModel):
    """What a parent sees when looking up a school by code — no admin/contact details."""

    name: str
    short_name: str
    code: str
    location: str
    logo_url: str | None

    model_config = {'from_attributes': True}


UpdateCategory = Literal['announcement', 'workload', 'achievement', 'reminder']
UpdateChannel = Literal['app', 'sms']


class UpdateCreateRequest(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    body: str = Field(min_length=2, max_length=2000)
    category: UpdateCategory = 'announcement'
    channel: UpdateChannel = 'app'


class UpdateResponse(BaseModel):
    id: uuid.UUID
    school_id: uuid.UUID
    title: str
    body: str
    category: str
    channel: str
    created_at: datetime

    model_config = {'from_attributes': True}
