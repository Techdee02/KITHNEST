import json
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest
from fastapi import HTTPException

from app.config import settings
from app.schemas_ai import ChatMessage
from app.services.ai_service import chat_reply, generate_insight


def _groq_response(content: str) -> httpx.Response:
    request = httpx.Request('POST', 'https://api.groq.com/openai/v1/chat/completions')
    return httpx.Response(200, request=request, json={'choices': [{'message': {'content': content}}]})


def _mock_client(response: httpx.Response) -> MagicMock:
    client = MagicMock()
    client.post = AsyncMock(return_value=response)
    context_manager = MagicMock()
    context_manager.__aenter__ = AsyncMock(return_value=client)
    context_manager.__aexit__ = AsyncMock(return_value=False)
    return context_manager, client


@pytest.mark.asyncio
async def test_generate_insight_returns_model_text_and_sends_language_instruction():
    ctx_manager, client = _mock_client(_groq_response('Great progress this term!'))
    with patch('app.services.ai_service.settings.groq_api_key', 'test-key'):
        with patch('app.services.ai_service.httpx.AsyncClient', return_value=ctx_manager):
            result = await generate_insight('parent_progress', {'completion': 80}, 'yo')

    assert result == 'Great progress this term!'
    call_kwargs = client.post.call_args.kwargs
    assert call_kwargs['headers']['Authorization'] == 'Bearer test-key'
    system_message = call_kwargs['json']['messages'][0]['content']
    assert 'Yoruba' in system_message
    user_message = call_kwargs['json']['messages'][1]['content']
    assert '"completion": 80' in user_message


@pytest.mark.asyncio
async def test_generate_insight_without_api_key_raises_503():
    with patch('app.services.ai_service.settings.groq_api_key', None):
        with pytest.raises(HTTPException) as exc_info:
            await generate_insight('school_engagement', {}, 'en')
    assert exc_info.value.status_code == 503


@pytest.mark.asyncio
async def test_generate_insight_raises_502_on_groq_failure():
    ctx_manager, client = _mock_client(httpx.Response(500, request=httpx.Request('POST', 'https://api.groq.com')))
    with patch('app.services.ai_service.settings.groq_api_key', 'test-key'):
        with patch('app.services.ai_service.httpx.AsyncClient', return_value=ctx_manager):
            with pytest.raises(HTTPException) as exc_info:
                await generate_insight('parent_progress', {}, 'en')
    assert exc_info.value.status_code == 502


@pytest.mark.asyncio
async def test_chat_reply_includes_conversation_history_and_context():
    ctx_manager, client = _mock_client(_groq_response('Your child has 2 items due this week.'))
    messages = [
        ChatMessage(role='user', content='What is due this week?'),
    ]
    with patch('app.services.ai_service.settings.groq_api_key', 'test-key'):
        with patch('app.services.ai_service.httpx.AsyncClient', return_value=ctx_manager):
            reply = await chat_reply(messages, 'parent', {'pupil': 'Zainab'}, 'en')

    assert reply == 'Your child has 2 items due this week.'
    sent_messages = client.post.call_args.kwargs['json']['messages']
    assert sent_messages[-1] == {'role': 'user', 'content': 'What is due this week?'}
    assert 'Zainab' in sent_messages[0]['content']
    assert 'parent' in sent_messages[0]['content']
