import json

import httpx
from fastapi import HTTPException, status

from app.config import settings
from app.schemas_ai import ChatMessage, InsightKind, Language, Persona

GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'

LANGUAGE_NAMES: dict[Language, str] = {
    'en': 'English',
    'yo': 'Yoruba',
    'ig': 'Igbo',
    'ha': 'Hausa',
}

_BRAND_VOICE = (
    "You are part of Kithnest, a parent-first school app for Nigerian nursery and primary "
    "schools. Kithnest's tone is warm, reassuring, and plain-spoken — closer to a trusted "
    "family friend than a school administrator. Never invent facts that aren't in the data "
    "you're given; if something isn't in the data, don't mention it. Write in plain sentences "
    "with no markdown formatting — no asterisks, bullet points, or headings — since this is "
    "displayed as plain text."
)

_INSIGHT_INSTRUCTIONS: dict[InsightKind, str] = {
    'parent_progress': (
        "Write a short, warm progress summary (3-4 sentences) for a parent about their "
        "child, based on the workload and subject data below. Mention one concrete strength "
        "and, if there's overdue or upcoming work, one gentle, specific thing to watch for. "
        "Speak directly to the parent (\"your child\"), not in the third person."
    ),
    'school_engagement': (
        "Write a short, plain-spoken summary (3-4 sentences) for a school administrator about "
        "parent engagement and activity, based on the metrics and class data below. Call out "
        "one clear positive trend and one area that could use attention, if the data supports it."
    ),
}


def _language_instruction(language: Language) -> str:
    name = LANGUAGE_NAMES[language]
    if language == 'en':
        return 'Respond in English.'
    return (
        f'Respond entirely in {name}. Do not include an English translation unless the '
        f'{name} term for something is genuinely ambiguous.'
    )


async def _call_groq(messages: list[dict[str, str]], *, max_tokens: int = 400) -> str:
    if not settings.groq_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail='AI features are not configured yet — missing GROQ_API_KEY.',
        )

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                GROQ_CHAT_URL,
                headers={'Authorization': f'Bearer {settings.groq_api_key}'},
                json={
                    'model': settings.groq_model,
                    'messages': messages,
                    'temperature': 0.6,
                    'max_tokens': max_tokens,
                    # gpt-oss-120b is a reasoning model — it spends part of
                    # max_tokens on an internal reasoning trace before
                    # writing the actual reply. Left at the default, we saw
                    # it burn the entire budget reasoning and return empty
                    # content (finish_reason "length") on non-English,
                    # multi-field prompts. "low" is plenty for a short,
                    # warm summary and leaves the rest of the budget for
                    # the answer itself.
                    'reasoning_effort': 'low',
                },
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='Could not reach the AI service. Please try again.',
        ) from exc

    try:
        content = data['choices'][0]['message']['content'].strip()
    except (KeyError, IndexError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='The AI service returned an unexpected response.',
        ) from exc

    if not content:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail='The AI service returned an empty response. Please try again.',
        )
    return content


async def generate_insight(kind: InsightKind, context: dict, language: Language) -> str:
    system_prompt = f'{_BRAND_VOICE}\n\n{_INSIGHT_INSTRUCTIONS[kind]}\n\n{_language_instruction(language)}'
    messages = [
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': f'Data:\n{json.dumps(context, indent=2, default=str)}'},
    ]
    return await _call_groq(messages, max_tokens=600)


async def chat_reply(
    messages: list[ChatMessage],
    persona: Persona,
    context: dict,
    language: Language,
) -> str:
    audience = (
        "a parent checking in on their child's school activity"
        if persona == 'parent'
        else 'a school administrator reviewing their school in Kithnest'
    )
    system_prompt = (
        f'{_BRAND_VOICE}\n\n'
        f"You're chatting with {audience}. Answer their questions using only the data below — "
        "if the answer isn't in the data, say you don't have that information rather than "
        "guessing. Keep replies short and conversational, a few sentences at most.\n\n"
        f'{_language_instruction(language)}\n\n'
        f'Data:\n{json.dumps(context, indent=2, default=str)}'
    )
    groq_messages = [{'role': 'system', 'content': system_prompt}]
    groq_messages.extend({'role': m.role, 'content': m.content} for m in messages)
    return await _call_groq(groq_messages, max_tokens=600)
