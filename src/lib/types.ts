export interface School {
  id: string
  name: string
  shortName: string
  code: string
  location: string
  motto: string
}

export interface ClassRoom {
  id: string
  schoolId: string
  name: string
  themeName: string
  teacherName: string
  pupilCount: number
}

export interface Subject {
  id: string
  name: string
  colorToken: 'marigold' | 'teal' | 'coral'
}

export interface Pupil {
  id: string
  name: string
  preferredName: string
  classId: string
  avatarInitials: string
  avatarColor: 'marigold' | 'teal' | 'coral'
}

export interface ParentAccount {
  id: string
  name: string
  phone: string
  pupilIds: string[]
  schoolId: string
}

export type WorkloadStatus = 'upcoming' | 'completed' | 'overdue'
export type WorkloadType = 'assignment' | 'classwork' | 'reading' | 'project' | 'test'

export interface WorkloadItem {
  id: string
  pupilId: string
  subjectId: string
  title: string
  description: string
  type: WorkloadType
  weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  dueDate: string
  status: WorkloadStatus
}

export type NotificationCategory = 'announcement' | 'workload' | 'achievement' | 'reminder'
export type NotificationChannel = 'app' | 'sms'

export interface NotificationItem {
  id: string
  parentId: string
  title: string
  body: string
  timestamp: string
  category: NotificationCategory
  channel: NotificationChannel
  read: boolean
}

export type RosterStatus = 'active' | 'invited' | 'inactive'

export interface RosterEntry {
  id: string
  parentName: string
  phone: string
  pupilName: string
  classId: string
  status: RosterStatus
  lastActive: string
}

export interface EngagementMetric {
  id: string
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down' | 'flat'
}
