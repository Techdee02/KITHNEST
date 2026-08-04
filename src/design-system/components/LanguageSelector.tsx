import type { Language } from '../../lib/aiClient'
import { cn } from '../cn'

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'yo', label: 'Yorùbá' },
  { code: 'ig', label: 'Igbo' },
  { code: 'ha', label: 'Hausa' },
]

interface LanguageSelectorProps {
  value: Language
  onChange: (language: Language) => void
  className?: string
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-pill bg-ink-100 p-1', className)}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={cn(
            'rounded-pill px-2.5 py-1 text-xs font-semibold transition-colors',
            value === lang.code ? 'bg-white text-ink-900 shadow-warm-sm' : 'text-ink-500 hover:text-ink-700',
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
