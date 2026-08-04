import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { useParentData } from '../context/ParentDataContext'
import { ParentTopBar } from '../components/ParentTopBar'
import { ParentBottomNav } from '../components/ParentBottomNav'
import { ParentSidebar } from '../components/ParentSidebar'
import { OfflineBanner } from '../../../design-system/components/OfflineBanner'
import { Toast } from '../../../design-system/components/Toast'
import { ChatWidget } from '../../../design-system/components/ChatWidget'

export default function ParentLayout() {
  const { isOffline, syncError, dismissSyncError, syncNow, parentName, selectedPupil, workloadForSelectedPupil, notifications, linkedSchool } =
    useParentData()

  const chatContext = useMemo(
    () => ({
      parent: parentName,
      pupil: selectedPupil?.preferredName,
      school: linkedSchool?.shortName,
      workload: workloadForSelectedPupil.map((i) => ({ title: i.title, status: i.status, dueDate: i.dueDate })),
      recentUpdates: notifications.slice(0, 5).map((n) => ({ title: n.title, category: n.category })),
    }),
    [parentName, selectedPupil, linkedSchool, workloadForSelectedPupil, notifications],
  )

  return (
    <div className="flex min-h-svh bg-ink-50">
      <ParentSidebar />

      <div className="flex min-h-svh flex-1 flex-col">
        <ParentTopBar />
        <OfflineBanner isOffline={isOffline} />
        <main className="flex-1 px-5 pb-8 pt-4 sm:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
        <ParentBottomNav />
      </div>

      <Toast message={syncError} onDismiss={dismissSyncError} onRetry={syncNow} />
      <ChatWidget persona="parent" context={chatContext} />
    </div>
  )
}
