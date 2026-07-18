import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { cn } from '../cn'

interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
  tone?: 'neutral' | 'error'
  className?: string
}

export function EmptyState({
  icon = 'search',
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center gap-3 rounded-card border border-dashed px-6 py-10',
        tone === 'error'
          ? 'border-coral-300 bg-coral-50'
          : 'border-ink-200 bg-ink-50',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          tone === 'error' ? 'bg-coral-100 text-coral-600' : 'bg-white text-ink-500',
        )}
      >
        <Icon name={tone === 'error' ? 'alert' : icon} className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold text-ink-900">{title}</p>
        {description && <p className="text-sm text-ink-500 max-w-xs">{description}</p>}
      </div>
      {action}
    </div>
  )
}
