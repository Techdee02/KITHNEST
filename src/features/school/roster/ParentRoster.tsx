import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSchoolData } from '../context/SchoolDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { Badge } from '../../../design-system/components/Badge'
import { Icon } from '../../../design-system/components/Icon'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { EmptyState } from '../../../design-system/components/EmptyState'
import { cn } from '../../../design-system/cn'
import type { RosterStatus } from '../../../lib/types'

const statusTone: Record<RosterStatus, 'success' | 'marigold' | 'neutral'> = {
  active: 'success',
  invited: 'marigold',
  inactive: 'neutral',
}

const statusLabel: Record<RosterStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  inactive: 'Inactive',
}

export default function ParentRoster() {
  const { classes, selectedClassId, selectClass, rosterForSelectedClass } = useSchoolData()
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setIsLoading(true)
    fakeFetch(true, { delayMs: 500 }).then(() => setIsLoading(false))
  }, [selectedClassId])

  const filtered = useMemo(() => {
    if (!query.trim()) return rosterForSelectedClass
    const q = query.toLowerCase()
    return rosterForSelectedClass.filter(
      (r) => r.parentName.toLowerCase().includes(q) || r.pupilName.toLowerCase().includes(q),
    )
  }, [rosterForSelectedClass, query])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Parent roster</h1>
        <p className="mt-1 text-sm text-ink-500">Connected parents across every class.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => selectClass('all')}
            className={cn(
              'shrink-0 rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              selectedClassId === 'all' ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-500',
            )}
          >
            All classes
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              type="button"
              onClick={() => selectClass(cls.id)}
              className={cn(
                'shrink-0 rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                selectedClassId === cls.id ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-500',
              )}
            >
              {cls.themeName}
            </button>
          ))}
        </div>

        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parent or pupil…"
            className="w-full rounded-pill border border-ink-200 bg-white py-2 pl-9 pr-4 text-sm text-ink-900 placeholder:text-ink-300 focus:border-marigold-400 focus:outline-none focus:ring-2 focus:ring-marigold-100 sm:w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-card" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="overflow-hidden rounded-card border border-ink-100 bg-white">
          {filtered.map((entry, i) => {
            const cls = classes.find((c) => c.id === entry.classId)
            return (
              <div
                key={entry.id}
                className={cn(
                  'flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4',
                  i !== filtered.length - 1 && 'border-b border-ink-100',
                )}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-ink-900">{entry.parentName}</p>
                  <p className="text-xs text-ink-500">Parent of {entry.pupilName}</p>
                </div>
                <div className="text-xs text-ink-500 sm:w-36">{cls?.themeName}</div>
                <div className="flex items-center gap-1.5 text-xs text-ink-500 sm:w-32">
                  <Icon name="phone" className="h-3.5 w-3.5 text-ink-300" />
                  {entry.phone}
                </div>
                <div className="text-xs text-ink-400 sm:w-28">{entry.lastActive}</div>
                <Badge tone={statusTone[entry.status]} className="sm:w-fit">
                  {statusLabel[entry.status]}
                </Badge>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon="search"
          title="No matches"
          description="Try a different name, or clear the search to see the full roster."
        />
      )}
    </motion.div>
  )
}
