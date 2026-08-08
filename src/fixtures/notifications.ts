import type { NotificationItem } from '../lib/types'

export const notifications: NotificationItem[] = [
  {
    id: 'ntf-1',
    parentId: 'par-adeyemi',
    title: "Zainab was named Pupil of the Week!",
    body: 'Mrs. Adebayo recognised Zainab for her improvement in Numeracy this week. Well done!',
    timestamp: '2026-08-08T08:10:00',
    category: 'achievement',
    channel: 'app',
    read: false,
  },
  {
    id: 'ntf-2',
    parentId: 'par-adeyemi',
    title: 'Reminder: PTA meeting tomorrow',
    body: 'The Term 2 PTA meeting holds tomorrow, Sunday, at 10:00 AM in the school hall. All parents are encouraged to attend.',
    timestamp: '2026-08-07T16:45:00',
    category: 'reminder',
    channel: 'sms',
    read: false,
  },
  {
    id: 'ntf-3',
    parentId: 'par-adeyemi',
    title: "Zainab's English composition is overdue",
    body: '"My Weekend" composition was due Thursday and has not been submitted. Please check her school bag.',
    timestamp: '2026-08-07T09:20:00',
    category: 'workload',
    channel: 'app',
    read: true,
  },
  {
    id: 'ntf-4',
    parentId: 'par-adeyemi',
    title: 'Founder’s Day rehearsal moved to Thursday',
    body: 'The Founder’s Day rehearsal originally scheduled for Wednesday has been moved to Thursday, 13th August, after closing hours.',
    timestamp: '2026-08-06T13:05:00',
    category: 'announcement',
    channel: 'sms',
    read: true,
  },
  {
    id: 'ntf-5',
    parentId: 'par-adeyemi',
    title: "Kanyin's colouring homework needs to come back",
    body: 'The "My Family" colouring sheet was due Friday. Kindly send it back with Kanyin on Monday.',
    timestamp: '2026-08-06T07:30:00',
    category: 'workload',
    channel: 'app',
    read: true,
  },
  {
    id: 'ntf-6',
    parentId: 'par-adeyemi',
    title: 'New Term 2 fee schedule published',
    body: 'The updated Term 2 fee schedule is now available on the school notice board and will be shared with parents shortly.',
    timestamp: '2026-08-04T11:00:00',
    category: 'announcement',
    channel: 'sms',
    read: true,
  },
  {
    id: 'ntf-7',
    parentId: 'par-adeyemi',
    title: 'Basic Science project materials needed',
    body: 'Primary 3 pupils should bring an empty plastic bottle and cotton wool for next week’s Basic Science project.',
    timestamp: '2026-07-31T15:15:00',
    category: 'workload',
    channel: 'app',
    read: true,
  },
]

export const notificationsForParent = (parentId: string) =>
  notifications
    .filter((n) => n.parentId === parentId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
