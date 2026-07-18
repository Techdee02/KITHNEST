import { Outlet } from 'react-router-dom'
import { SchoolTopNav } from '../components/SchoolTopNav'

export default function SchoolLayout() {
  return (
    <div className="min-h-svh bg-ink-50">
      <SchoolTopNav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
