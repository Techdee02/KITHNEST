import uuid
from abc import ABC, abstractmethod
from pathlib import Path

from fastapi import UploadFile

from app.config import settings


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, file: UploadFile, *, folder: str) -> str:
        """Persist the file and return a publicly-accessible URL."""


class LocalDiskStorage(StorageBackend):
    """
    Saves to backend/uploads, served by FastAPI's StaticFiles mount at /uploads.
    Stands in for Supabase Storage until a real project exists — swap the
    instance created in app/main.py for SupabaseStorage later; nothing else
    in the app needs to change since both implement `.save()`.
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
    Not wired up yet — implement once a real Supabase project exists, using
    the service-role client to upload to a `school-logos` bucket and return
    its public URL. Kept here so the swap is a one-line change in main.py,
    not a rewrite.
    """

    async def save(self, file: UploadFile, *, folder: str) -> str:
        raise NotImplementedError('SupabaseStorage is not implemented yet — use LocalDiskStorage for now.')


storage: StorageBackend = LocalDiskStorage()
