import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from '../../../design-system/components/Icon'
import { Logomark, Wordmark } from '../../../design-system/components/Logomark'
import { useParentData } from '../context/ParentDataContext'
import { cn } from '../../../design-system/cn'

const tabs: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/parent', label: 'Home', icon: 'home', end: true },
  { to: '/parent/workload', label: 'Workload', icon: 'calendar' },
  { to: '/parent/notifications', label: 'Updates', icon: 'bell' },
  { to: '/parent/profile', label: 'Profile', icon: 'user' },
]

/** Desktop-only vertical nav — mobile keeps ParentBottomNav instead. */
export function ParentSidebar() {
  const { unreadCount } = useParentData()

  return (
    <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-ink-100 bg-white px-5 py-6 lg:flex">
      <div className="flex items-center gap-2 px-1">
        <Logomark className="h-7 w-7" />
        <Wordmark className="text-lg" />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors',
                isActive ? 'bg-marigold-100 text-marigold-800' : 'text-ink-500 hover:bg-ink-50 hover:text-ink-800',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <Icon name={tab.icon} className="h-5 w-5" strokeWidth={isActive ? 2.1 : 1.75} />
                  {tab.icon === 'bell' && unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-coral-500 text-[0.55rem] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </span>
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
