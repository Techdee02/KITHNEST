from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi import HTTPException

from app.services.tts_service import synthesize_speech


def _mock_client(response: httpx.Response) -> MagicMock:
    client = MagicMock()
    client.post = AsyncMock(return_value=response)
    context_manager = MagicMock()
    context_manager.__aenter__ = AsyncMock(return_value=client)
    context_manager.__aexit__ = AsyncMock(return_value=False)
    return context_manager, client


@pytest.mark.asyncio
async def test_synthesize_speech_returns_audio_bytes():
    request = httpx.Request('POST', 'https://yarngpt.ai/api/v1/tts')
    response = httpx.Response(200, request=request, content=b'fake-mp3-bytes')
    ctx_manager, client = _mock_client(response)

    with patch('app.services.tts_service.settings.yarngpt_api_key', 'test-key'):
        with patch('app.services.tts_service.httpx.AsyncClient', return_value=ctx_manager):
            audio = await synthesize_speech('Hello there', 'en')

    assert audio == b'fake-mp3-bytes'
    call_kwargs = client.post.call_args.kwargs
    assert call_kwargs['headers']['Authorization'] == 'Bearer test-key'
    assert call_kwargs['json']['text'] == 'Hello there'
    assert call_kwargs['json']['response_format'] == 'mp3'


@pytest.mark.asyncio
async def test_synthesize_speech_without_api_key_raises_501():
    with patch('app.services.tts_service.settings.yarngpt_api_key', None):
        with pytest.raises(HTTPException) as exc_info:
            await synthesize_speech('Hello there', 'en')
    assert exc_info.value.status_code == 501


@pytest.mark.asyncio
async def test_synthesize_speech_raises_502_on_yarngpt_failure():
    ctx_manager, client = _mock_client(httpx.Response(500, request=httpx.Request('POST', 'https://yarngpt.ai')))

    with patch('app.services.tts_service.settings.yarngpt_api_key', 'test-key'):
        with patch('app.services.tts_service.httpx.AsyncClient', return_value=ctx_manager):
            with pytest.raises(HTTPException) as exc_info:
                await synthesize_speech('Hello there', 'en')
    assert exc_info.value.status_code == 502
