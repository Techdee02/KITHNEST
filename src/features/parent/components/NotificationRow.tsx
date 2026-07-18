import type { NotificationItem } from '../../../lib/types'
import { Icon, type IconName } from '../../../design-system/components/Icon'
import { formatRelativeTime } from '../../../lib/formatRelativeTime'
import { cn } from '../../../design-system/cn'

const categoryIcon: Record<NotificationItem['category'], IconName> = {
  announcement: 'megaphone',
  workload: 'book',
  achievement: 'trophy',
  reminder: 'clock',
}

const categoryTone: Record<NotificationItem['category'], string> = {
  announcement: 'bg-teal-100 text-teal-700',
  workload: 'bg-marigold-100 text-marigold-700',
  achievement: 'bg-coral-100 text-coral-700',
  reminder: 'bg-ink-100 text-ink-600',
}

export function NotificationRow({
  notification,
  onOpen,
}: {
  notification: NotificationItem
  onOpen: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(notification.id)}
      className={cn(
        'flex w-full items-start gap-3 rounded-card border p-4 text-left transition-shadow hover:shadow-warm-sm',
        notification.read ? 'border-ink-100 bg-white' : 'border-marigold-200 bg-marigold-50/60',
      )}
    >
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', categoryTone[notification.category])}>
        <Icon name={categoryIcon[notification.category]} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {notification.channel === 'sms' && (
            <span className="flex items-center gap-1 rounded-pill bg-ink-900 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-white">
              <Icon name="message" className="h-2.5 w-2.5" /> SMS
            </span>
          )}
          {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-coral-500" />}
        </div>
        <p className="mt-1 font-display text-sm font-semibold text-ink-900">{notification.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{notification.body}</p>
        <p className="mt-1.5 text-[0.7rem] font-medium text-ink-400">
          {formatRelativeTime(notification.timestamp)}
        </p>
      </div>
    </button>
  )
}
