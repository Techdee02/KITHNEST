import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'

export function OfflineBanner({ isOffline }: { isOffline: boolean }) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isOffline) setDismissed(false)
  }, [isOffline])

  return (
    <AnimatePresence initial={false}>
      {isOffline && !dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-2.5 bg-ink-900 px-4 py-2.5 text-ink-50">
            <Icon name="wifi-off" className="h-4 w-4 shrink-0" />
            <p className="flex-1 text-xs font-medium">
              You&apos;re offline — showing the last data we saved on this phone.
            </p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="shrink-0 rounded-full p-1 text-ink-300 hover:text-white"
              aria-label="Dismiss offline notice"
            >
              <Icon name="x" className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
