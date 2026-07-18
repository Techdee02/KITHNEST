import { cn } from '../cn'

type Color = 'marigold' | 'teal' | 'coral'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const colorClasses: Record<Color, string> = {
  marigold: 'bg-marigold-200 text-marigold-800',
  teal: 'bg-teal-200 text-teal-800',
  coral: 'bg-coral-200 text-coral-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
}

export function Avatar({
  initials,
  color = 'marigold',
  size = 'md',
  className,
}: {
  initials: string
  color?: Color
  size?: Size
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-display font-semibold shrink-0',
        colorClasses[color],
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  )
}
