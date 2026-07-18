import type { HTMLAttributes } from 'react'
import { cn } from '../cn'

type Tone = 'marigold' | 'teal' | 'coral' | 'neutral' | 'success'

const toneClasses: Record<Tone, string> = {
  marigold: 'bg-marigold-100 text-marigold-800',
  teal: 'bg-teal-100 text-teal-800',
  coral: 'bg-coral-100 text-coral-800',
  neutral: 'bg-ink-100 text-ink-600',
  success: 'bg-teal-100 text-teal-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold tracking-wide',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
