import { Icon } from './Icon'
import { cn } from '../cn'

/**
 * Clearly-labeled stand-in for real photography. Sized and positioned
 * exactly where the final image will go — swap the background for an
 * <img> once Akeem supplies the asset described in `brief`.
 *
 * Use `compact` for small/avatar-sized spots where the full brief text
 * won't fit — the brief still renders via the title tooltip.
 */
export function ImagePlaceholder({
  brief,
  aspect = 'aspect-[4/3]',
  compact = false,
  className,
}: {
  brief: string
  aspect?: string
  compact?: boolean
  className?: string
}) {
  return (
    <div
      title={brief}
      className={cn(
        'flex flex-col items-center justify-center gap-2 overflow-hidden rounded-card border-2 border-dashed border-ink-300 bg-ink-100/70 text-center',
        compact ? 'px-2' : 'px-6',
        aspect,
        className,
      )}
    >
      <Icon name="sparkle" className={cn('shrink-0 text-ink-400', compact ? 'h-4 w-4' : 'h-5 w-5')} />
      {!compact && (
        <p className="text-xs font-medium text-ink-500 max-w-[22rem]">Image needed: {brief}</p>
      )}
    </div>
  )
}
