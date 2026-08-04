import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParentData } from '../context/ParentDataContext'
import { fakeFetch } from '../../../lib/fakeFetch'
import { NotificationRow } from '../components/NotificationRow'
import { SkeletonCard } from '../../../design-system/components/Skeleton'
import { Skeleton } from '../../../design-system/components/Skeleton'
import { EmptyState } from '../../../design-system/components/EmptyState'
import { cn } from '../../../design-system/cn'

export default function NotificationsFeed() {
  const { notifications, markNotificationRead, unreadCount, isLoadingNotifications } = useParentData()
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    fakeFetch(true, { delayMs: 500 }).then(() => setIsLoading(false))
  }, [])

  const visible = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  if (isLoading || isLoadingNotifications) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
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
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Updates</h1>
      </div>

      <div className="flex gap-2">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-pill border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === f ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 text-ink-500',
            )}
          >
            {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="space-y-3">
          {visible.map((n) => (
            <NotificationRow key={n.id} notification={n} onOpen={markNotificationRead} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="bell"
          title={filter === 'unread' ? "You're all caught up" : 'No updates yet'}
          description={
            filter === 'unread'
              ? 'No unread updates right now — check back after school hours.'
              : "School announcements and reminders will show up here as they're posted."
          }
        />
      )}
    </motion.div>
  )
}
