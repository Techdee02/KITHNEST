import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { timeOfDayGreeting } from '../../../lib/greeting'
import { firstNameOf } from '../../../lib/parentName'
import { subjects } from '../../../fixtures/subjects'
import { WorkloadCard } from '../components/WorkloadCard'
import { NotificationRow } from '../components/NotificationRow'
import { SkeletonCard } from '../../../design-system/components/Skeleton'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { EmptyState } from '../../../design-system/components/EmptyState'
import { Icon } from '../../../design-system/components/Icon'
import { Card } from '../../../design-system/components/Card'
import { AiInsightCard } from '../../../design-system/components/AiInsightCard'

const WEEKDAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export default function ParentDashboard() {
  const {
    parentName,
    selectedPupil,
    classNameForPupil,
    workloadForSelectedPupil,
    notifications,
    markNotificationRead,
    isLoadingNotifications,
  } = useParentData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fakeFetch(true, { delayMs: 650 }).then(() => setIsLoading(false))
  }, [selectedPupil?.id])

  const todayCode = WEEKDAY_MAP[new Date().getDay()]
  const todayItems = workloadForSelectedPupil.filter((item) => item.weekday === todayCode)
  const overdueItems = workloadForSelectedPupil.filter((item) => item.status === 'overdue')
  const upcomingItems = workloadForSelectedPupil
    .filter((item) => item.status === 'upcoming')
    .slice(0, 3)
  const recentNotifications = notifications.slice(0, 2)

  const completion = useMemo(() => {
    const total = workloadForSelectedPupil.length
    const completed = workloadForSelectedPupil.filter((i) => i.status === 'completed').length
    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }, [workloadForSelectedPupil])

  const subjectBreakdown = useMemo(() => {
    return subjects
      .map((subject) => {
        const items = workloadForSelectedPupil.filter((i) => i.subjectId === subject.id)
        const completed = items.filter((i) => i.status === 'completed').length
        return { subject: subject.name, total: items.length, completed }
      })
      .filter((row) => row.total > 0)
  }, [workloadForSelectedPupil])

  const insightContext = useMemo(
    () => ({
      pupil: selectedPupil?.preferredName,
      completion,
      subjectBreakdown,
      overdue: overdueItems.map((i) => ({ title: i.title, dueDate: i.dueDate })),
      upcoming: upcomingItems.map((i) => ({ title: i.title, dueDate: i.dueDate })),
    }),
    [selectedPupil, completion, subjectBreakdown, overdueItems, upcomingItems],
  )

  if (isLoading || isLoadingNotifications) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-48" />
        </div>
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
      className="space-y-7"
    >
      <div>
        <p className="text-sm text-ink-500">{timeOfDayGreeting()},</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          {firstNameOf(parentName)}
        </h1>
        {selectedPupil && (
          <p className="mt-1 text-sm text-ink-500">
            {selectedPupil.preferredName} · {classNameForPupil(selectedPupil)}
          </p>
        )}
      </div>

      <AiInsightCard kind="parent_progress" title="AI summary" context={insightContext} showVoiceButton />

      {overdueItems.length > 0 && (
        <Link
          to="/parent/workload"
          className="flex items-center gap-3 rounded-card border border-coral-200 bg-coral-50 p-4"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral-100 text-coral-600">
            <Icon name="alert" className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-coral-800">
              {overdueItems.length} item{overdueItems.length > 1 ? 's' : ''} need{overdueItems.length === 1 ? 's' : ''} attention
            </p>
            <p className="text-xs text-coral-600">Tap to see what&apos;s overdue</p>
          </div>
          <Icon name="chevron-right" className="h-4 w-4 text-coral-400" />
        </Link>
      )}

      <div className="grid gap-7 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-900">Today</h2>
          </div>
          {todayItems.length > 0 ? (
            <div className="space-y-3">
              {todayItems.map((item) => (
                <WorkloadCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="check-circle"
              title={todayCode === 'Sat' || todayCode === 'Sun' ? 'No school today' : 'All caught up for today'}
              description={
                todayCode === 'Sat' || todayCode === 'Sun'
                  ? 'Enjoy the weekend — the next school day picks up on Monday.'
                  : "Nothing new posted for today yet. We'll notify you the moment something comes in."
              }
            />
          )}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink-900">Outstanding this week</h2>
            <Link to="/parent/workload" className="text-xs font-semibold text-marigold-700">
              See all
            </Link>
          </div>
          {upcomingItems.length > 0 ? (
            <div className="space-y-3">
              {upcomingItems.map((item) => (
                <WorkloadCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="check-circle"
              title="Nothing outstanding"
              description="Everything posted so far has been completed. Great work!"
            />
          )}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink-900">Recent updates</h2>
          <Link to="/parent/notifications" className="text-xs font-semibold text-marigold-700">
            See all
          </Link>
        </div>
        {recentNotifications.length > 0 ? (
          <div className="space-y-3">
            {recentNotifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onOpen={markNotificationRead} />
            ))}
          </div>
        ) : (
          <Card className="p-5 text-center text-sm text-ink-500">No updates from school yet.</Card>
        )}
      </section>
    </motion.div>
  )
}
