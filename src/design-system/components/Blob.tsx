import { cn } from '../cn'

type Tone = 'marigold' | 'teal' | 'coral'

const toneClasses: Record<Tone, string> = {
  marigold: 'fill-marigold-200',
  teal: 'fill-teal-200',
  coral: 'fill-coral-200',
}

/**
 * A soft organic blob used sparingly as background texture (per the
 * 80/20 grid-vs-organic balance) — never as a functional UI element.
 */
export function Blob({ tone = 'marigold', className }: { tone?: Tone; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn('pointer-events-none select-none opacity-70', toneClasses[tone], className)}
      aria-hidden="true"
    >
      <path d="M45.2,-58.3C58.6,-49.9,69.4,-35.9,73.7,-20.1C78,-4.3,75.8,13.3,68.1,27.9C60.4,42.5,47.2,54.1,32.2,61.6C17.2,69.1,0.4,72.5,-16.5,70.3C-33.4,68.1,-50.4,60.3,-61.5,47.2C-72.6,34.1,-77.8,15.7,-76.1,-1.9C-74.4,-19.5,-65.8,-36.3,-53,-46.8C-40.2,-57.3,-23.2,-61.5,-5.6,-58.4C12,-55.3,31.8,-66.7,45.2,-58.3Z" transform="translate(100 100)" />
    </svg>
  )
}
