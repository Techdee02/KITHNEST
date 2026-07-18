import type { WorkloadItem } from '../../../lib/types'
import { subjectById } from '../../../fixtures/subjects'
import { Badge } from '../../../design-system/components/Badge'
import { Icon, type IconName } from '../../../design-system/components/Icon'
import { cn } from '../../../design-system/cn'

const typeIcon: Record<WorkloadItem['type'], IconName> = {
  assignment: 'book',
  classwork: 'book',
  reading: 'book',
  project: 'sparkle',
  test: 'shield',
}

const statusTone = {
  upcoming: 'marigold',
  completed: 'success',
  overdue: 'coral',
} as const

const statusLabel: Record<WorkloadItem['status'], string> = {
  upcoming: 'Upcoming',
  completed: 'Completed',
  overdue: 'Needs attention',
}

export function WorkloadCard({ item }: { item: WorkloadItem }) {
  const subject = subjectById(item.subjectId)

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-card border bg-white p-4 transition-shadow hover:shadow-warm-sm',
        item.status === 'overdue' ? 'border-coral-200' : 'border-ink-100',
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          subject?.colorToken === 'teal' && 'bg-teal-100 text-teal-700',
          subject?.colorToken === 'coral' && 'bg-coral-100 text-coral-700',
          (!subject || subject.colorToken === 'marigold') && 'bg-marigold-100 text-marigold-700',
        )}
      >
        <Icon name={typeIcon[item.type]} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {subject?.name}
          </p>
          <Badge tone={statusTone[item.status]}>{statusLabel[item.status]}</Badge>
        </div>
        <p className="mt-0.5 font-display text-sm font-semibold text-ink-900">{item.title}</p>
        <p className="mt-1 text-xs text-ink-500">{item.description}</p>
        <p className="mt-2 text-[0.7rem] font-medium text-ink-400">
          {item.weekday} · {new Date(item.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </p>
      </div>
    </div>
  )
}
