import { motion } from 'framer-motion'

export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 9,
  colorClassName = 'text-teal-500',
  label,
}: {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  colorClassName?: string
  label?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-ink-100"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          className={colorClassName}
          stroke="currentColor"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (clamped / 100) * circumference }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-xl font-semibold text-ink-900">{clamped}%</span>
        {label && <span className="text-[0.65rem] text-ink-500">{label}</span>}
      </div>
    </div>
  )
}
