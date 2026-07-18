import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { defaultSchool } from '../../../fixtures/schools'
import { classes as allClasses } from '../../../fixtures/classes'
import { rosterForClass } from '../../../fixtures/rosterEntries'
import { engagementMetrics, totalConnectedParents, totalPupils } from '../../../fixtures/engagementMetrics'
import { fakeFetch } from '../../../lib/fakeFetch'
import { useLocalStorageState } from '../../../lib/useLocalStorageState'
import type { ClassRoom, RosterEntry } from '../../../lib/types'

interface SchoolDataValue {
  isAuthenticated: boolean
  isLoggingIn: boolean
  loginError: string | null
  login: (schoolCode: string, password: string) => Promise<boolean>
  logout: () => void

  school: typeof defaultSchool
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
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState('kithnest.school.authed', false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [selectedClassId, setSelectedClassId] = useLocalStorageState<string | 'all'>(
    'kithnest.school.selectedClass',
    'all',
  )

  const login = useCallback(
    async (schoolCode: string, password: string) => {
      setLoginError(null)
      setIsLoggingIn(true)
      try {
        await fakeFetch(true, { delayMs: 900 })
        const codeMatches = schoolCode.trim().toUpperCase() === defaultSchool.code
        const passwordValid = password.trim().length >= 4

        if (!codeMatches) {
          setLoginError("We couldn't find a school with that code. Contact Kithnest support if this persists.")
          return false
        }
        if (!passwordValid) {
          setLoginError('Enter your admin password (at least 4 characters for this demo).')
          return false
        }

        setIsAuthenticated(true)
        return true
      } finally {
        setIsLoggingIn(false)
      }
    },
    [setIsAuthenticated],
  )

  const logout = useCallback(() => setIsAuthenticated(false), [setIsAuthenticated])

  const rosterForSelectedClass = useMemo(() => {
    if (selectedClassId === 'all') {
      return allClasses.flatMap((c) => rosterForClass(c.id))
    }
    return rosterForClass(selectedClassId)
  }, [selectedClassId])

  const value: SchoolDataValue = {
    isAuthenticated,
    isLoggingIn,
    loginError,
    login,
    logout,
    school: defaultSchool,
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
