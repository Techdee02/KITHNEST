import { Icon } from './Icon'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import { cn } from '../cn'

export function SyncStatus({
  lastSyncedAt,
  isOffline,
  isSyncing,
  onSync,
}: {
  lastSyncedAt: string
  isOffline: boolean
  isSyncing: boolean
  onSync: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSync}
      disabled={isOffline || isSyncing}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 disabled:cursor-not-allowed"
    >
      <Icon
        name="refresh"
        className={cn('h-3.5 w-3.5', isSyncing && 'animate-spin', isOffline && 'opacity-40')}
      />
      <span>
        {isOffline
          ? 'Offline — last synced ' + formatRelativeTime(lastSyncedAt)
          : isSyncing
            ? 'Syncing…'
            : 'Synced ' + formatRelativeTime(lastSyncedAt)}
      </span>
    </button>
  )
}
