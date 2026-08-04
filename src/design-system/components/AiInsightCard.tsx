import { useRef, useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Icon } from './Icon'
import { LanguageSelector } from './LanguageSelector'
import { fetchInsight, fetchSpeech, type InsightKind, type Language } from '../../lib/aiClient'
import { ApiError } from '../../lib/apiClient'

interface AiInsightCardProps {
  kind: InsightKind
  title: string
  context: Record<string, unknown>
  /** Parent side only — lets low-literacy parents listen instead of read. */
  showVoiceButton?: boolean
}

export function AiInsightCard({ kind, title, context, showVoiceButton }: AiInsightCardProps) {
  const [language, setLanguage] = useState<Language>('en')
  const [summary, setSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [voiceState, setVoiceState] = useState<'idle' | 'loading' | 'playing' | 'unavailable'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  async function handleGenerate() {
    setIsLoading(true)
    setError(null)
    setVoiceState('idle')
    try {
      const { summary } = await fetchInsight(kind, language, context)
      setSummary(summary)
    } catch {
      setError("Couldn't generate an insight right now. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleListen() {
    if (!summary) return
    setVoiceState('loading')
    try {
      const blob = await fetchSpeech(summary, language)
      const url = URL.createObjectURL(blob)
      if (!audioRef.current) audioRef.current = new Audio()
      audioRef.current.src = url
      audioRef.current.onended = () => setVoiceState('idle')
      await audioRef.current.play()
      setVoiceState('playing')
    } catch (err) {
      setVoiceState(err instanceof ApiError && err.status === 501 ? 'unavailable' : 'idle')
    }
  }

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-marigold-100 text-marigold-700">
            <Icon name="sparkle" className="h-4 w-4" />
          </div>
          <p className="font-display text-base font-semibold text-ink-900">{title}</p>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} />
      </div>

      {summary && <p className="mt-4 text-sm leading-relaxed text-ink-700">{summary}</p>}
      {error && <p className="mt-4 text-sm text-coral-600">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isLoading}>
          <Icon name="sparkle" className="h-3.5 w-3.5" />
          {isLoading ? 'Thinking…' : summary ? 'Regenerate' : 'Get AI insight'}
        </Button>

        {showVoiceButton && summary && (
          <Button variant="ghost" size="sm" onClick={handleListen} disabled={voiceState === 'loading'}>
            <Icon name="volume" className="h-3.5 w-3.5" />
            {voiceState === 'loading' ? 'Loading audio…' : voiceState === 'playing' ? 'Playing…' : 'Listen to summary'}
          </Button>
        )}
      </div>

      {voiceState === 'unavailable' && (
        <p className="mt-2 text-xs text-ink-400">Voice summaries are coming very soon.</p>
      )}
    </Card>
  )
}
