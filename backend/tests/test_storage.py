import io
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi import HTTPException
from starlette.datastructures import Headers, UploadFile

from app.storage import SupabaseStorage


def _upload_file(filename='logo.png', content_type='image/png', content=b'fake-image-bytes'):
    return UploadFile(
        file=io.BytesIO(content),
        filename=filename,
        headers=Headers({'content-type': content_type}),
    )


def _mock_client(response: httpx.Response) -> MagicMock:
    """Builds a mock that behaves like `async with httpx.AsyncClient() as client: await client.post(...)`."""
    client = MagicMock()
    client.post = AsyncMock(return_value=response)
    context_manager = MagicMock()
    context_manager.__aenter__ = AsyncMock(return_value=client)
    context_manager.__aexit__ = AsyncMock(return_value=False)
    return context_manager


@pytest.mark.asyncio
async def test_save_uploads_and_returns_public_url():
    storage = SupabaseStorage(
        base_url='https://xyzcompany.supabase.co',
        service_role_key='service-role-secret',
        bucket='school-logos',
    )
    ok_response = httpx.Response(200, request=httpx.Request('POST', 'https://xyzcompany.supabase.co'))

    with patch('app.storage.httpx.AsyncClient', return_value=_mock_client(ok_response)) as client_cls:
        url = await storage.save(_upload_file(), folder='logos')

    assert url.startswith('https://xyzcompany.supabase.co/storage/v1/object/public/school-logos/logos/')
    assert url.endswith('.png')

    # Confirm the upload actually targeted the (non-public) object endpoint with auth headers set.
    context_manager = client_cls.return_value
    client = await context_manager.__aenter__()
    call = client.post.call_args
    assert call.args[0].startswith('https://xyzcompany.supabase.co/storage/v1/object/school-logos/logos/')
    assert call.kwargs['headers']['Authorization'] == 'Bearer service-role-secret'
    assert call.kwargs['headers']['apikey'] == 'service-role-secret'
    assert call.kwargs['content'] == b'fake-image-bytes'


@pytest.mark.asyncio
async def test_save_raises_a_clean_error_when_supabase_rejects_the_upload():
    storage = SupabaseStorage(
        base_url='https://xyzcompany.supabase.co',
        service_role_key='wrong-key',
        bucket='school-logos',
    )
    request = httpx.Request('POST', 'https://xyzcompany.supabase.co')
    error_response = httpx.Response(403, request=request, json={'message': 'Invalid key'})

    with patch('app.storage.httpx.AsyncClient', return_value=_mock_client(error_response)):
        with pytest.raises(HTTPException) as exc_info:
            await storage.save(_upload_file(), folder='logos')

    assert exc_info.value.status_code == 502


@pytest.mark.asyncio
async def test_save_generates_a_unique_filename_preserving_the_extension():
    storage = SupabaseStorage(base_url='https://xyzcompany.supabase.co', service_role_key='k', bucket='school-logos')
    ok_response = httpx.Response(200, request=httpx.Request('POST', 'https://xyzcompany.supabase.co'))

    with patch('app.storage.httpx.AsyncClient', return_value=_mock_client(ok_response)):
        url_a = await storage.save(_upload_file(filename='a.jpg', content_type='image/jpeg'), folder='logos')
    with patch('app.storage.httpx.AsyncClient', return_value=_mock_client(ok_response)):
        url_b = await storage.save(_upload_file(filename='a.jpg', content_type='image/jpeg'), folder='logos')

    assert url_a.endswith('.jpg')
    assert url_a != url_b  # never overwrites a previous upload
