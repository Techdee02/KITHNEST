import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { classes as allClasses } from '../../../fixtures/classes'
import { rosterForClass } from '../../../fixtures/rosterEntries'
import { engagementMetrics, totalConnectedParents, totalPupils } from '../../../fixtures/engagementMetrics'
import { apiFetch, ApiError, resolveApiUrl } from '../../../lib/apiClient'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'
import type { ClassRoom, RegisteredSchool, RosterEntry } from '../../../lib/types'

export interface SchoolRegisterInput {
  name: string
  shortName: string
  location: string
  motto?: string
  adminName: string
  adminEmail: string
  password: string
}

interface SchoolApiResponse {
  id: string
  name: string
  short_name: string
  code: string
  location: string
  motto: string | null
  admin_name: string
  admin_email: string
  logo_url: string | null
  created_at: string
}

interface TokenResponse {
  school: SchoolApiResponse
  access_token: string
}

function mapSchool(data: SchoolApiResponse): RegisteredSchool {
  return {
    id: data.id,
    name: data.name,
    shortName: data.short_name,
    code: data.code,
    location: data.location,
    motto: data.motto,
    adminName: data.admin_name,
    adminEmail: data.admin_email,
    logoUrl: data.logo_url ? resolveApiUrl(data.logo_url) : null,
    createdAt: data.created_at,
  }
}

export interface PostUpdateInput {
  title: string
  body: string
  category?: 'announcement' | 'workload' | 'achievement' | 'reminder'
  channel?: 'app' | 'sms'
}

interface SchoolDataValue {
  // Auth/session — real, backed by the FastAPI + Postgres backend.
  isAuthenticated: boolean
  isLoadingProfile: boolean
  isSubmitting: boolean
  authError: string | null
  register: (input: SchoolRegisterInput) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void

  school: RegisteredSchool | null
  uploadLogo: (file: File) => Promise<boolean>
  isUploadingLogo: boolean
  logoError: string | null

  postUpdate: (input: PostUpdateInput) => Promise<boolean>
  isPostingUpdate: boolean
  postUpdateError: string | null

  // Operational data — still Phase 1 mock fixtures. Real classes/roster/
  // engagement data is a follow-up phase, scoped out of school registration.
  classes: ClassRoom[]
  selectedClassId: string | 'all'
  selectClass: (id: string | 'all') => void
  rosterForSelectedClass: RosterEntry[]
  metrics: typeof engagementMetrics
  totalConnectedParents: number
  totalPupils: number
}

const SchoolDataContext = createContext<SchoolDataValue | null>(null)

export function SchoolDataProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorageState<string | null>('kithnest.school.token', null)
  const [school, setSchool] = useState<RegisteredSchool | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isPostingUpdate, setIsPostingUpdate] = useState(false)
  const [postUpdateError, setPostUpdateError] = useState<string | null>(null)

  const [selectedClassId, setSelectedClassId] = useLocalStorageState<string | 'all'>(
    'kithnest.school.selectedClass',
    'all',
  )

  useEffect(() => {
    if (!token || school) return
    setIsLoadingProfile(true)
    apiFetch<SchoolApiResponse>('/schools/me', { token })
      .then((data) => setSchool(mapSchool(data)))
      .catch(() => {
        // Stored token is stale/invalid — drop it and send them back to login.
        setToken(null)
      })
      .finally(() => setIsLoadingProfile(false))
  }, [token, school, setToken])

  const register = useCallback(
    async (input: SchoolRegisterInput) => {
      setAuthError(null)
      setIsSubmitting(true)
      try {
        const data = await apiFetch<TokenResponse>('/schools/register', {
          method: 'POST',
          body: {
            name: input.name,
            short_name: input.shortName,
            location: input.location,
            motto: input.motto || undefined,
            admin_name: input.adminName,
            admin_email: input.adminEmail,
            password: input.password,
          },
        })
        setSchool(mapSchool(data.school))
        setToken(data.access_token)
        return true
      } catch (err) {
        setAuthError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [setToken],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setAuthError(null)
      setIsSubmitting(true)
      try {
        const data = await apiFetch<TokenResponse>('/schools/login', {
          method: 'POST',
          body: { admin_email: email, password },
        })
        setSchool(mapSchool(data.school))
        setToken(data.access_token)
        return true
      } catch (err) {
        setAuthError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [setToken],
  )

  const logout = useCallback(() => {
    setToken(null)
    setSchool(null)
  }, [setToken])

  const uploadLogo = useCallback(
    async (file: File) => {
      if (!token) return false
      setLogoError(null)
      setIsUploadingLogo(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const data = await apiFetch<SchoolApiResponse>('/schools/me/logo', {
          method: 'POST',
          token,
          body: formData,
          isFormData: true,
        })
        setSchool(mapSchool(data))
        return true
      } catch (err) {
        setLogoError(err instanceof ApiError ? err.message : 'Could not upload the logo. Please try again.')
        return false
      } finally {
        setIsUploadingLogo(false)
      }
    },
    [token],
  )

  const postUpdate = useCallback(
    async (input: PostUpdateInput) => {
      if (!token) return false
      setPostUpdateError(null)
      setIsPostingUpdate(true)
      try {
        await apiFetch('/schools/me/updates', {
          method: 'POST',
          token,
          body: {
            title: input.title,
            body: input.body,
            category: input.category ?? 'announcement',
            channel: input.channel ?? 'app',
          },
        })
        return true
      } catch (err) {
        setPostUpdateError(err instanceof ApiError ? err.message : 'Could not post that update. Please try again.')
        return false
      } finally {
        setIsPostingUpdate(false)
      }
    },
    [token],
  )

  const rosterForSelectedClass = useMemo(() => {
    if (selectedClassId === 'all') {
      return allClasses.flatMap((c) => rosterForClass(c.id))
    }
    return rosterForClass(selectedClassId)
  }, [selectedClassId])

  const value: SchoolDataValue = {
    isAuthenticated: Boolean(token),
    isLoadingProfile,
    isSubmitting,
    authError,
    register,
    login,
    logout,
    school,
    uploadLogo,
    isUploadingLogo,
    logoError,
    postUpdate,
    isPostingUpdate,
    postUpdateError,
    classes: allClasses,
    selectedClassId,
    selectClass: setSelectedClassId,
    rosterForSelectedClass,
    metrics: engagementMetrics,
    totalConnectedParents,
    totalPupils,
  }

  return <SchoolDataContext.Provider value={value}>{children}</SchoolDataContext.Provider>
}

export function useSchoolData() {
  const ctx = useContext(SchoolDataContext)
  if (!ctx) throw new Error('useSchoolData must be used within SchoolDataProvider')
  return ctx
}
