import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultParent } from '../../../fixtures/parents'
import { pupils as allPupils } from '../../../fixtures/pupils'
import { classes as allClasses } from '../../../fixtures/classes'
import { workloadForPupil } from '../../../fixtures/workloadItems'
import { fakeFetch } from '../../../lib/fakeFetch'
import { apiFetch, ApiError } from '../../../lib/apiClient'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'
import type { NotificationItem, Pupil, WorkloadItem } from '../../../lib/types'

interface LinkedSchool {
  name: string
  shortName: string
  code: string
  location: string
  logoUrl: string | null
}

interface SchoolPublicApiResponse {
  name: string
  short_name: string
  code: string
  location: string
  logo_url: string | null
}

interface UpdateApiResponse {
  id: string
  school_id: string
  title: string
  body: string
  category: string
  channel: string
  created_at: string
}

function mapLinkedSchool(data: SchoolPublicApiResponse): LinkedSchool {
  return {
    name: data.name,
    shortName: data.short_name,
    code: data.code,
    location: data.location,
    logoUrl: data.logo_url,
  }
}

function mapUpdate(data: UpdateApiResponse): NotificationItem {
  return {
    id: data.id,
    parentId: 'linked-school-parent',
    title: data.title,
    body: data.body,
    timestamp: data.created_at,
    category: data.category as NotificationItem['category'],
    channel: data.channel as NotificationItem['channel'],
    read: false,
  }
}

interface ParentDataValue {
  isAuthenticated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: (schoolCode: string, phone: string) => Promise<boolean>
  logout: () => void

  linkedSchool: LinkedSchool | null

  parentName: string
  pupils: Pupil[]
  selectedPupilId: string
  selectedPupil: Pupil | undefined
  selectPupil: (pupilId: string) => void
  classNameForPupil: (pupil: Pupil | undefined) => string
  workloadForSelectedPupil: WorkloadItem[]

  notifications: NotificationItem[]
  isLoadingNotifications: boolean
  unreadCount: number
  markNotificationRead: (id: string) => void
  refreshNotifications: () => void

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
  const [schoolCode, setSchoolCode] = useLocalStorageState<string | null>('kithnest.parent.schoolCode', null)
  const [linkedSchool, setLinkedSchool] = useState<LinkedSchool | null>(null)
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

  const [realNotifications, setRealNotifications] = useState<NotificationItem[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [notificationsFetchToken, setNotificationsFetchToken] = useState(0)

  const [lastSyncedAt, setLastSyncedAt] = useLocalStorageState(
    'kithnest.parent.lastSynced',
    '2026-07-18T08:12:00',
  )
  const [isOffline, setIsOffline] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)

  // Resolve the linked school (and its real updates) whenever we have a
  // school code but haven't loaded its details yet — covers both a fresh
  // login and a page reload where only the code survived in localStorage.
  useEffect(() => {
    if (!schoolCode) return

    apiFetch<SchoolPublicApiResponse>(`/schools/lookup/${schoolCode}`)
      .then((data) => setLinkedSchool(mapLinkedSchool(data)))
      .catch(() => {
        // The stored code no longer resolves (school deleted, typo survived
        // a refresh, etc.) — don't leave the parent stuck on broken data.
        setSchoolCode(null)
        setIsAuthenticated(false)
      })

    setIsLoadingNotifications(true)
    apiFetch<UpdateApiResponse[]>(`/schools/lookup/${schoolCode}/updates`)
      .then((data) => setRealNotifications(data.map(mapUpdate)))
      .catch(() => setRealNotifications([]))
      .finally(() => setIsLoadingNotifications(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolCode, notificationsFetchToken])

  const login = useCallback(
    async (code: string, phone: string) => {
      setLoginError(null)
      setIsLoggingIn(true)
      try {
        const normalizedCode = code.trim().toUpperCase()
        const phoneDigits = phone.replace(/\D/g, '')
        const phoneValid = phoneDigits.length >= 10

        if (!phoneValid) {
          setLoginError('Enter the phone number registered with your school.')
          return false
        }

        const data = await apiFetch<SchoolPublicApiResponse>(`/schools/lookup/${normalizedCode}`)
        setLinkedSchool(mapLinkedSchool(data))
        setSchoolCode(normalizedCode)
        setIsAuthenticated(true)
        setLastSyncedAt(new Date().toISOString())
        return true
      } catch (err) {
        setLoginError(
          err instanceof ApiError ? err.message : "We couldn't find a school with that code. Double-check it and try again.",
        )
        return false
      } finally {
        setIsLoggingIn(false)
      }
    },
    [setIsAuthenticated, setSchoolCode, setLastSyncedAt],
  )

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setSchoolCode(null)
    setLinkedSchool(null)
  }, [setIsAuthenticated, setSchoolCode])

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
    return realNotifications
      .map((n) => ({ ...n, read: readOverrides[n.id] ?? n.read }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [realNotifications, readOverrides])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const markNotificationRead = useCallback(
    (id: string) => {
      setReadOverrides((prev) => ({ ...prev, [id]: true }))
    },
    [setReadOverrides],
  )

  const refreshNotifications = useCallback(() => setNotificationsFetchToken((t) => t + 1), [])

  const toggleOffline = useCallback(() => setIsOffline((v) => !v), [])

  const syncNow = useCallback(async () => {
    if (isOffline) return
    setIsSyncing(true)
    setSyncError(null)
    try {
      await fakeFetch(true, { delayMs: 600 })
      refreshNotifications()
      setLastSyncedAt(new Date().toISOString())
    } catch {
      setSyncError("Couldn't sync — check your connection and try again.")
    } finally {
      setIsSyncing(false)
    }
  }, [isOffline, setLastSyncedAt, refreshNotifications])

  const dismissSyncError = useCallback(() => setSyncError(null), [])

  const value: ParentDataValue = {
    isAuthenticated,
    isLoggingIn,
    loginError,
    login,
    logout,
    linkedSchool,
    parentName: defaultParent.name,
    pupils,
    selectedPupilId: selectedPupil?.id ?? selectedPupilId,
    selectedPupil,
    selectPupil: setSelectedPupilId,
    classNameForPupil,
    workloadForSelectedPupil,
    notifications,
    isLoadingNotifications,
    unreadCount,
    markNotificationRead,
    refreshNotifications,
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
