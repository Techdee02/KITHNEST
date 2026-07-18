import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useParentData } from '../features/parent/context/ParentDataContext'
import { useSchoolData } from '../features/school/context/SchoolDataContext'

export function RequireParentAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useParentData()
  if (!isAuthenticated) return <Navigate to="/parent/login" replace />
  return <>{children}</>
}

export function RequireSchoolAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSchoolData()
  if (!isAuthenticated) return <Navigate to="/school/login" replace />
  return <>{children}</>
}
