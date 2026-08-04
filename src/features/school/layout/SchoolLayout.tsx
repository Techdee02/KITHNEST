import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { SchoolTopNav } from '../components/SchoolTopNav'
import { useSchoolData } from '../context/SchoolDataContext'
import { ChatWidget } from '../../../design-system/components/ChatWidget'

export default function SchoolLayout() {
  const { school, classes, metrics, totalConnectedParents, totalPupils } = useSchoolData()

  const chatContext = useMemo(
    () => ({
      school: school?.name,
      totalConnectedParents,
      totalPupils,
      metrics: metrics.map((m) => ({ label: m.label, value: m.value, trend: m.trend })),
      classes: classes.map((c) => ({ name: c.name, teacher: c.teacherName })),
    }),
    [school, totalConnectedParents, totalPupils, metrics, classes],
  )

  return (
    <div className="min-h-svh bg-ink-50">
      <SchoolTopNav />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
      <ChatWidget persona="school" context={chatContext} />
    </div>
  )
}
