import { apiFetch, ApiError, API_BASE_URL } from './apiClient'

export type Language = 'en' | 'yo' | 'ig' | 'ha'
export type InsightKind = 'parent_progress' | 'school_engagement'
export type Persona = 'parent' | 'school'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Keys AiInsightCard persists a generated summary under — shared so logout can clear them. */
export function insightStorageKeys(kind: InsightKind) {
  return {
    summary: `kithnest.ai.summary.${kind}`,
    language: `kithnest.ai.language.${kind}`,
  }
}

export function clearPersistedInsight(kind: InsightKind) {
  const keys = insightStorageKeys(kind)
  window.localStorage.removeItem(keys.summary)
  window.localStorage.removeItem(keys.language)
}

export function fetchInsight(kind: InsightKind, language: Language, context: Record<string, unknown>) {
  return apiFetch<{ summary: string }>('/ai/insight', {
    method: 'POST',
    body: { kind, language, context },
  })
}

export function sendChatMessage(
  persona: Persona,
  language: Language,
  context: Record<string, unknown>,
  messages: ChatMessage[],
) {
  return apiFetch<{ reply: string }>('/ai/chat', {
    method: 'POST',
    body: { persona, language, context, messages },
  })
}

/** Not wrapped by apiFetch — the response is an audio blob, not JSON. */
export async function fetchSpeech(text: string, language: Language): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/ai/speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = await response.json()
      if (typeof data.detail === 'string') message = data.detail
    } catch {
      // response body wasn't JSON — fall back to the generic message above
    }
    throw new ApiError(response.status, message)
  }

  return response.blob()
}
