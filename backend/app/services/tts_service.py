import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.schemas_ai import Language

YARNGPT_TTS_URL = 'https://yarngpt.ai/api/v1/tts'

# YarnGPT's voices aren't language-scoped — the model handles English, Yoruba,
# Igbo, and Hausa text with any voice. We just pick one that matches
# Kithnest's warm, reassuring tone (see ai_service.py's _BRAND_VOICE).
DEFAULT_VOICE = 'Femi'

# The API caps input at 2000 characters; our summaries are a few sentences,
# but this keeps a runaway context from ever reaching YarnGPT as a 4xx.
MAX_TEXT_LENGTH = 2000


async def synthesize_speech(text: str, language: Language) -> bytes:
    if not settings.yarngpt_api_key:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail='Voice summaries are coming very soon — not wired up yet.',
        )

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                YARNGPT_TTS_URL,
                headers={'Authorization': f'Bearer {settings.yarngpt_api_key}'},
                json={
                    'text': text[:MAX_TEXT_LENGTH],
                    'voice': DEFAULT_VOICE,
                    'response_format': 'mp3',
                },
            )
            response.raise_for_status()
            return response.content
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Could not reach the voice service. Please try again.',
        ) from exc
