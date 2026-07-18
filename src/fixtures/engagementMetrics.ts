import type { EngagementMetric } from '../lib/types'

export const engagementMetrics: EngagementMetric[] = [
  { id: 'eng-active', label: 'Parents active this week', value: '78%', trend: '+6% vs last week', trendDirection: 'up' },
  { id: 'eng-response', label: 'Avg. notification open rate', value: '91%', trend: '+3% vs last week', trendDirection: 'up' },
  { id: 'eng-workload', label: 'Workload items posted', value: '46', trend: 'across 4 classes', trendDirection: 'flat' },
  { id: 'eng-unread', label: 'Unread announcements', value: '12', trend: '-4 vs last week', trendDirection: 'down' },
]

export const totalConnectedParents = 25
export const totalPupils = 84
