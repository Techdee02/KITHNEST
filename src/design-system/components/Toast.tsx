import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'

export function Toast({
  message,
  onDismiss,
  onRetry,
}: {
  message: string | null
  onDismiss: () => void
  onRetry?: () => void
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-20 z-30 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3 text-sm text-white shadow-warm-lg"
        >
          <Icon name="alert" className="h-4 w-4 shrink-0 text-coral-300" />
          <span className="flex-1">{message}</span>
          {onRetry && (
            <button type="button" onClick={onRetry} className="font-semibold text-marigold-300">
              Retry
            </button>
          )}
          <button type="button" onClick={onDismiss} aria-label="Dismiss">
            <Icon name="x" className="h-4 w-4 text-ink-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
