/** Abstract nest mark — overlapping woven arcs cradling a small seed. No stock icon. */
export function Logomark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M4 24c2-8 8-13 16-13s14 5 16 13"
        fill="none"
        stroke="var(--color-teal-500)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M8 27c2.5-6.5 7-10.5 12-10.5s9.5 4 12 10.5"
        fill="none"
        stroke="var(--color-marigold-500)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="25" r="4" fill="var(--color-coral-500)" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-display font-semibold">Kith</span>
      <span className="font-display font-semibold text-marigold-600">nest</span>
    </span>
  )
}
