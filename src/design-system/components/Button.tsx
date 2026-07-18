import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'md' | 'lg' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-marigold-500 text-ink-900 hover:bg-marigold-400 active:bg-marigold-600 shadow-warm-sm',
  secondary:
    'bg-teal-500 text-white hover:bg-teal-400 active:bg-teal-600 shadow-warm-sm',
  outline:
    'bg-transparent text-ink-900 border border-ink-300 hover:border-ink-400 hover:bg-ink-100',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3.5 py-2 gap-1.5',
  md: 'text-[0.95rem] px-5 py-3 gap-2',
  lg: 'text-base px-6 py-3.5 gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-pill font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
