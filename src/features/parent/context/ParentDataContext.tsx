import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultSchool } from '../../../fixtures/schools'
import { defaultParent } from '../../../fixtures/parents'
import { pupils as allPupils } from '../../../fixtures/pupils'
import { classes as allClasses } from '../../../fixtures/classes'
import { workloadForPupil } from '../../../fixtures/workloadItems'
import { notificationsForParent } from '../../../fixtures/notifications'
import { fakeFetch } from '../../../lib/fakeFetch'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'
import type { NotificationItem, Pupil, WorkloadItem } from '../../../lib/types'

interface ParentDataValue {
  isAuthenticated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: (schoolCode: string, phone: string) => Promise<boolean>
  logout: () => void

  parentName: string
  pupils: Pupil[]
  selectedPupilId: string
  selectedPupil: Pupil | undefined
  selectPupil: (pupilId: string) => void
  classNameForPupil: (pupil: Pupil | undefined) => string
  workloadForSelectedPupil: WorkloadItem[]

  notifications: NotificationItem[]
  unreadCount: number
  markNotificationRead: (id: string) => void

  lastSyncedAt: string
  isOffline: boolean
  toggleOffline: () => void
  syncNow: () => Promise<void>
  isSyncing: boolean
  syncError: string | null
  dismissSyncError: () => void
}

const ParentDataContext = createContext<ParentDataValue | null>(null)

export function ParentDataProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState('kithnest.parent.authed', false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const [selectedPupilId, setSelectedPupilId] = useLocalStorageState(
    'kithnest.parent.selectedPupil',
    defaultParent.pupilIds[0],
  )

  const [readOverrides, setReadOverrides] = useLocalStorageState<Record<string, boolean>>(
    'kithnest.parent.readNotifications',
    {},
  )

  const [lastSyncedAt, setLastSyncedAt] = useLocalStorageState(
    'kithnest.parent.lastSynced',
    '2026-07-18T08:12:00',
  )
  const [isOffline, setIsOffline] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  const login = useCallback(
    async (schoolCode: string, phone: string) => {
      setLoginError(null)
      setIsLoggingIn(true)
      try {
        await fakeFetch(true, { delayMs: 900 })
        const codeMatches = schoolCode.trim().toUpperCase() === defaultSchool.code
        const phoneDigits = phone.replace(/\D/g, '')
        const phoneValid = phoneDigits.length >= 10

        if (!codeMatches) {
          setLoginError("We couldn't find a school with that code. Double-check it and try again.")
          return false
        }
        if (!phoneValid) {
          setLoginError('Enter the phone number registered with your school.')
          return false
        }

        setIsAuthenticated(true)
        setLastSyncedAt(new Date().toISOString())
        return true
      } finally {
        setIsLoggingIn(false)
      }
    },
    [setIsAuthenticated, setLastSyncedAt],
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
  }, [setIsAuthenticated])

  const pupils = useMemo(
    () => allPupils.filter((p) => defaultParent.pupilIds.includes(p.id)),
    [],
  )

  const selectedPupil = useMemo(
    () => pupils.find((p) => p.id === selectedPupilId) ?? pupils[0],
    [pupils, selectedPupilId],
  )

  const classNameForPupil = useCallback((pupil: Pupil | undefined) => {
    if (!pupil) return ''
    const cls = allClasses.find((c) => c.id === pupil.classId)
    return cls ? `${cls.name} · ${cls.themeName}` : ''
  }, [])

  const workloadForSelectedPupil = useMemo(
    () => (selectedPupil ? workloadForPupil(selectedPupil.id) : []),
    [selectedPupil],
  )

  const notifications = useMemo(() => {
    const base = notificationsForParent(defaultParent.id)
    return base.map((n) => ({ ...n, read: readOverrides[n.id] ?? n.read }))
  }, [readOverrides])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markNotificationRead = useCallback(
    (id: string) => {
      setReadOverrides((prev) => ({ ...prev, [id]: true }))
    },
    [setReadOverrides],
  )

  const toggleOffline = useCallback(() => setIsOffline((v) => !v), [])

  const syncNow = useCallback(async () => {
    if (isOffline) return
    setIsSyncing(true)
    setSyncError(null)
    try {
      await fakeFetch(true, { delayMs: 1100, failRate: 0.3 })
      setLastSyncedAt(new Date().toISOString())
    } catch {
      setSyncError("Couldn't sync — check your connection and try again.")
    } finally {
      setIsSyncing(false)
    }
  }, [isOffline, setLastSyncedAt])

  const dismissSyncError = useCallback(() => setSyncError(null), [])

  const value: ParentDataValue = {
    isAuthenticated,
    isLoggingIn,
    loginError,
    login,
    logout,
    parentName: defaultParent.name,
    pupils,
    selectedPupilId: selectedPupil?.id ?? selectedPupilId,
    selectedPupil,
    selectPupil: setSelectedPupilId,
    classNameForPupil,
    workloadForSelectedPupil,
    notifications,
    unreadCount,
    markNotificationRead,
    lastSyncedAt,
    isOffline,
    toggleOffline,
    syncNow,
    isSyncing,
    syncError,
    dismissSyncError,
  }

  return <ParentDataContext.Provider value={value}>{children}</ParentDataContext.Provider>
}

export function useParentData() {
  const ctx = useContext(ParentDataContext)
  if (!ctx) throw new Error('useParentData must be used within ParentDataProvider')
  return ctx
}
