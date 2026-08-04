import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { Avatar } from '../../../design-system/components/Avatar'
import { Icon } from '../../../design-system/components/Icon'
import { SyncStatus } from '../../../design-system/components/SyncStatus'
import { Logomark } from '../../../design-system/components/Logomark'
import { classes } from '../../../fixtures/classes'
import { cn } from '../../../design-system/cn'

export function ParentTopBar() {
  const {
    pupils,
    selectedPupil,
    selectPupil,
    lastSyncedAt,
    isOffline,
    isSyncing,
    syncNow,
    toggleOffline,
    linkedSchool,
  } = useParentData()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-ink-50/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-5 pt-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Logomark className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={toggleOffline}
            className={cn(
              'flex items-center gap-1 rounded-pill px-2.5 py-1 text-[0.65rem] font-semibold transition-colors',
              isOffline ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-400 hover:text-ink-600',
            )}
            title="Demo control — simulate offline"
          >
            <Icon name="wifi-off" className="h-3 w-3" />
            {isOffline ? 'Offline' : 'Simulate offline'}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => pupils.length > 1 && setSwitcherOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-2xl py-1 pr-2 text-left"
          >
            {selectedPupil && (
              <Avatar initials={selectedPupil.avatarInitials} color={selectedPupil.avatarColor} size="md" />
            )}
            <div>
              <p className="font-display text-base font-semibold text-ink-900">
                {selectedPupil?.preferredName}
              </p>
              <p className="text-xs text-ink-500">{linkedSchool?.shortName}</p>
            </div>
            {pupils.length > 1 && (
              <Icon
                name="chevron-down"
                className={cn('h-4 w-4 text-ink-400 transition-transform', switcherOpen && 'rotate-180')}
              />
            )}
          </button>

          <SyncStatus lastSyncedAt={lastSyncedAt} isOffline={isOffline} isSyncing={isSyncing} onSync={syncNow} />
        </div>

        <AnimatePresence>
          {switcherOpen && pupils.length > 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 pb-3 pt-2">
                {pupils.map((pupil) => {
                  const cls = classes.find((c) => c.id === pupil.classId)
                  const active = pupil.id === selectedPupil?.id
                  return (
                    <button
                      key={pupil.id}
                      type="button"
                      onClick={() => {
                        selectPupil(pupil.id)
                        setSwitcherOpen(false)
                      }}
                      className={cn(
                        'flex flex-1 items-center gap-2 rounded-2xl border px-3 py-2 text-left transition-colors',
                        active ? 'border-marigold-400 bg-marigold-50' : 'border-ink-100 bg-white',
                      )}
                    >
                      <Avatar initials={pupil.avatarInitials} color={pupil.avatarColor} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{pupil.preferredName}</p>
                        <p className="text-[0.65rem] text-ink-500">{cls?.themeName}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
