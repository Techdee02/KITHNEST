import { Outlet } from 'react-router-dom'
import { useParentData } from '../context/ParentDataContext'
import { ParentTopBar } from '../components/ParentTopBar'
import { ParentBottomNav } from '../components/ParentBottomNav'
import { ParentSidebar } from '../components/ParentSidebar'
import { OfflineBanner } from '../../../design-system/components/OfflineBanner'
import { Toast } from '../../../design-system/components/Toast'

export default function ParentLayout() {
  const { isOffline, syncError, dismissSyncError, syncNow } = useParentData()

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
    </div>
  )
}
