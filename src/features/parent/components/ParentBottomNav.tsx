import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from '../../../design-system/components/Icon'
import { useParentData } from '../context/ParentDataContext'
import { cn } from '../../../design-system/cn'

const tabs: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: '/parent', label: 'Home', icon: 'home', end: true },
  { to: '/parent/workload', label: 'Workload', icon: 'calendar' },
  { to: '/parent/notifications', label: 'Updates', icon: 'bell' },
  { to: '/parent/profile', label: 'Profile', icon: 'user' },
]

export function ParentBottomNav() {
  const { unreadCount } = useParentData()

  return (
    <nav className="sticky bottom-0 z-20 border-t border-ink-100 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabs.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-1 px-2 py-2.5 text-[0.7rem] font-medium transition-colors',
                  isActive ? 'text-marigold-700' : 'text-ink-400 hover:text-ink-600',
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
          </li>
        ))}
      </ul>
    </nav>
  )
}
