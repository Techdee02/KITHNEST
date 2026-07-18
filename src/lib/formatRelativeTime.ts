export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso)
  const diffMs = now.getTime() - then.getTime()
  const diffMin = Math.round(diffMs / 60000)

  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`

  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
