import { Outlet } from 'react-router-dom'
import { useParentData } from '../context/ParentDataContext'
import { ParentTopBar } from '../components/ParentTopBar'
import { ParentBottomNav } from '../components/ParentBottomNav'
import { OfflineBanner } from '../../../design-system/components/OfflineBanner'
import { Toast } from '../../../design-system/components/Toast'

export default function ParentLayout() {
  const { isOffline, syncError, dismissSyncError, syncNow } = useParentData()

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-ink-50">
      <ParentTopBar />
      <OfflineBanner isOffline={isOffline} />
      <main className="flex-1 px-5 pb-8 pt-4">
        <Outlet />
      </main>
      <ParentBottomNav />
      <Toast message={syncError} onDismiss={dismissSyncError} onRetry={syncNow} />
    </div>
  )
}
