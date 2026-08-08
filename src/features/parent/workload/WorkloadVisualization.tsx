import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { WorkloadCard } from '../components/WorkloadCard'
import { SkeletonCard } from '../../../design-system/components/Skeleton'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { EmptyState } from '../../../design-system/components/EmptyState'
import { cn } from '../../../design-system/cn'
import type { WorkloadItem } from '../../../lib/types'

const DAYS: WorkloadItem['weekday'][] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WEEK_CUTOFF = '2026-08-09'

const dayStatusColor: Record<WorkloadItem['status'], string> = {
  completed: 'bg-teal-500',
  upcoming: 'bg-marigold-500',
  overdue: 'bg-coral-500',
}

export default function WorkloadVisualization() {
  const { selectedPupil, classNameForPupil, workloadForSelectedPupil } = useParentData()
  const [isLoading, setIsLoading] = useState(true)
  const [week, setWeek] = useState<'this' | 'next'>('this')
  const [activeDay, setActiveDay] = useState<WorkloadItem['weekday'] | 'all'>('all')

  useEffect(() => {
    setIsLoading(true)
    fakeFetch(true, { delayMs: 550 }).then(() => setIsLoading(false))
  }, [selectedPupil?.id])

  const weekItems = useMemo(
    () =>
      workloadForSelectedPupil.filter((item) =>
        week === 'this' ? item.dueDate < WEEK_CUTOFF : item.dueDate >= WEEK_CUTOFF,
      ),
    [workloadForSelectedPupil, week],
  )

  const visibleItems = activeDay === 'all' ? weekItems : weekItems.filter((i) => i.weekday === activeDay)

  const counts = {
    completed: weekItems.filter((i) => i.status === 'completed').length,
    upcoming: weekItems.filter((i) => i.status === 'upcoming').length,
    overdue: weekItems.filter((i) => i.status === 'overdue').length,
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Workload</h1>
        {selectedPupil && (
          <p className="mt-1 text-sm text-ink-500">
            {selectedPupil.preferredName} · {classNameForPupil(selectedPupil)}
          </p>
        )}
      </div>

      <div className="flex rounded-2xl bg-ink-100 p-1">
        {(['this', 'next'] as const).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => {
              setWeek(w)
              setActiveDay('all')
            }}
            className={cn(
              'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors',
              week === w ? 'bg-white text-ink-900 shadow-warm-sm' : 'text-ink-500',
            )}
          >
            {w === 'this' ? 'This week' : 'Next week'}
          </button>
        ))}
      </div>

      <div className="flex gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-ink-500">
          <span className="h-2 w-2 rounded-full bg-teal-500" /> {counts.completed} completed
        </span>
        <span className="flex items-center gap-1.5 text-ink-500">
          <span className="h-2 w-2 rounded-full bg-marigold-500" /> {counts.upcoming} upcoming
        </span>
        <span className="flex items-center gap-1.5 text-ink-500">
          <span className="h-2 w-2 rounded-full bg-coral-500" /> {counts.overdue} overdue
        </span>
      </div>

      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveDay('all')}
            className={cn(
              'shrink-0 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-colors',
              activeDay === 'all' ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-500',
            )}
          >
            All days
          </button>
          {DAYS.map((day) => {
            const dayItems = weekItems.filter((i) => i.weekday === day)
            const active = activeDay === day
            return (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(day)}
                className={cn(
                  'flex shrink-0 flex-col items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-semibold transition-colors',
                  active ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-500',
                )}
              >
                {day}
                <span className="flex gap-0.5">
                  {dayItems.length === 0 ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-200" />
                  ) : (
                    dayItems.map((i) => (
                      <span key={i.id} className={cn('h-1.5 w-1.5 rounded-full', dayStatusColor[i.status])} />
                    ))
                  )}
                </span>
              </button>
            )
          })}
        </div>
        {/* Fades the trailing edge so a peeking pill reads as "scroll for more", not a layout bug. */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-ink-50 to-transparent sm:hidden" />
      </div>

      {visibleItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleItems.map((item) => (
            <WorkloadCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="calendar"
          title="Nothing posted for this day"
          description="Check back later, or pick another day to see what's been posted."
        />
      )}
    </motion.div>
  )
}
