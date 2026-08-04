from typing import Any, Literal

from pydantic import BaseModel, Field

Language = Literal['en', 'yo', 'ig', 'ha']
InsightKind = Literal['parent_progress', 'school_engagement']
Persona = Literal['parent', 'school']


class InsightRequest(BaseModel):
    kind: InsightKind
    language: Language = 'en'
    # Loosely typed on purpose — shape varies by `kind`, and this data is
    # already computed client-side from Phase 1 fixtures. The backend
    # doesn't need its own copy of pupils/workload/roster to generate a
    # summary over it.
    context: dict[str, Any] = Field(default_factory=dict)


class InsightResponse(BaseModel):
    summary: str


class ChatMessage(BaseModel):
    role: Literal['user', 'assistant']
    content: str = Field(min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=40)
    persona: Persona
    language: Language = 'en'
    context: dict[str, Any] = Field(default_factory=dict)


class ChatResponse(BaseModel):
    reply: str


class SpeechRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)
    language: Language = 'en'
