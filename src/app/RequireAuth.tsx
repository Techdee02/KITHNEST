import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useParentData } from '../features/parent/context/ParentDataContext'
import { useSchoolData } from '../features/school/context/SchoolDataContext'
import { Icon } from '../design-system/components/Icon'

export function RequireParentAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useParentData()
  if (!isAuthenticated) return <Navigate to="/parent/login" replace />
  return <>{children}</>
}

export function RequireSchoolAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, school, isLoadingProfile } = useSchoolData()
  if (!isAuthenticated) return <Navigate to="/school/login" replace />

  // Token exists but the profile hasn't loaded yet (or failed silently) —
  // never render dashboard children with a null school.
  if (!school || isLoadingProfile) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-ink-50">
        <Icon name="refresh" className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    )
  }

  return <>{children}</>
}
