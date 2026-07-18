import type { ReactNode } from 'react'
import { ParentDataProvider } from '../features/parent/context/ParentDataContext'
import { SchoolDataProvider } from '../features/school/context/SchoolDataContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ParentDataProvider>
      <SchoolDataProvider>{children}</SchoolDataProvider>
    </ParentDataProvider>
  )
}
