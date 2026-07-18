import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProviders } from './app/AppProviders'
import { RequireParentAuth, RequireSchoolAuth } from './app/RequireAuth'
import Landing from './app/Landing'

import ParentLogin from './features/parent/onboarding/ParentLogin'
import ParentLayout from './features/parent/layout/ParentLayout'
import ParentDashboard from './features/parent/dashboard/ParentDashboard'
import WorkloadVisualization from './features/parent/workload/WorkloadVisualization'
import NotificationsFeed from './features/parent/notifications/NotificationsFeed'
import ChildProfile from './features/parent/profile/ChildProfile'

import SchoolLogin from './features/school/login/SchoolLogin'
import SchoolLayout from './features/school/layout/SchoolLayout'
import SchoolAdminDashboard from './features/school/dashboard/SchoolAdminDashboard'
import ParentRoster from './features/school/roster/ParentRoster'

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/parent/login" element={<ParentLogin />} />
          <Route
            path="/parent"
            element={
              <RequireParentAuth>
                <ParentLayout />
              </RequireParentAuth>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="workload" element={<WorkloadVisualization />} />
            <Route path="notifications" element={<NotificationsFeed />} />
            <Route path="profile" element={<ChildProfile />} />
          </Route>

          <Route path="/school/login" element={<SchoolLogin />} />
          <Route
            path="/school"
            element={
              <RequireSchoolAuth>
                <SchoolLayout />
              </RequireSchoolAuth>
            }
          >
            <Route index element={<SchoolAdminDashboard />} />
            <Route path="roster" element={<ParentRoster />} />
          </Route>
        </Routes>
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
