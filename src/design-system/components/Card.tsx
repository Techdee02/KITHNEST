import type { HTMLAttributes } from 'react'
import { cn } from '../cn'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card bg-white border border-ink-100 shadow-warm-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
