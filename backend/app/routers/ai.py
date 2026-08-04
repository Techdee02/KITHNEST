from fastapi import APIRouter
from fastapi.responses import Response

from app.schemas_ai import (
    ChatRequest,
    ChatResponse,
    InsightRequest,
    InsightResponse,
    SpeechRequest,
)
from app.services.ai_service import chat_reply, generate_insight
from app.services.tts_service import synthesize_speech

router = APIRouter(prefix='/ai', tags=['ai'])


@router.post('/insight', response_model=InsightResponse)
async def post_insight(payload: InsightRequest):
    summary = await generate_insight(payload.kind, payload.context, payload.language)
    return InsightResponse(summary=summary)


@router.post('/chat', response_model=ChatResponse)
async def post_chat(payload: ChatRequest):
    reply = await chat_reply(payload.messages, payload.persona, payload.context, payload.language)
    return ChatResponse(reply=reply)


@router.post('/speech')
async def post_speech(payload: SpeechRequest):
    audio = await synthesize_speech(payload.text, payload.language)
    return Response(content=audio, media_type='audio/mpeg')
