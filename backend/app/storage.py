import uuid
from abc import ABC, abstractmethod
from pathlib import Path

import httpx
from fastapi import HTTPException, UploadFile, status

from app.config import settings


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, file: UploadFile, *, folder: str) -> str:
        """Persist the file and return a publicly-accessible URL."""


class LocalDiskStorage(StorageBackend):
    """
    Saves to backend/uploads, served by FastAPI's StaticFiles mount at /uploads.
    Used automatically in local dev — see `_build_storage_backend()` below.
    """

    def __init__(self, base_dir: str = settings.upload_dir, public_base_url: str = '/uploads'):
        self.base_dir = Path(base_dir)
        self.public_base_url = public_base_url

    async def save(self, file: UploadFile, *, folder: str) -> str:
        target_dir = self.base_dir / folder
        target_dir.mkdir(parents=True, exist_ok=True)

        suffix = Path(file.filename or '').suffix or '.png'
        filename = f'{uuid.uuid4().hex}{suffix}'
        target_path = target_dir / filename

        contents = await file.read()
        target_path.write_bytes(contents)

        return f'{self.public_base_url}/{folder}/{filename}'


class SupabaseStorage(StorageBackend):
    """
    Uploads to a Supabase Storage bucket via its REST API, using the
    service-role key (server-side only — this key bypasses Row Level
    Security, so it must never reach the frontend).

    Talks to the Storage REST API directly with httpx rather than pulling in
    the full `supabase-py` client, which also bundles Auth/Realtime/Postgrest
    clients this app doesn't use — consistent with FastAPI owning auth
    directly instead of delegating to Supabase's GoTrue service.

    Requires the bucket to already exist and be set to public (Supabase
    Dashboard → Storage → New bucket → "Public bucket" on) — this class
    doesn't create it.
    """

    def __init__(self, base_url: str, service_role_key: str, bucket: str):
        self.base_url = base_url.rstrip('/')
        self.service_role_key = service_role_key
        self.bucket = bucket

    async def save(self, file: UploadFile, *, folder: str) -> str:
        suffix = Path(file.filename or '').suffix or '.png'
        object_path = f'{folder}/{uuid.uuid4().hex}{suffix}'
        contents = await file.read()

        upload_url = f'{self.base_url}/storage/v1/object/{self.bucket}/{object_path}'
        headers = {
            'Authorization': f'Bearer {self.service_role_key}',
            'apikey': self.service_role_key,
            'Content-Type': file.content_type or 'application/octet-stream',
        }

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                response = await client.post(upload_url, headers=headers, content=contents)
                response.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail='Could not reach file storage. Please try again.',
            ) from exc

        return f'{self.base_url}/storage/v1/object/public/{self.bucket}/{object_path}'


def _build_storage_backend() -> StorageBackend:
    if settings.supabase_url and settings.supabase_service_role_key:
        return SupabaseStorage(
            base_url=settings.supabase_url,
            service_role_key=settings.supabase_service_role_key,
            bucket=settings.supabase_storage_bucket,
        )
    return LocalDiskStorage()


storage: StorageBackend = _build_storage_backend()
