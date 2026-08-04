import { NavLink, useNavigate } from 'react-router-dom'
import { useSchoolData } from '../context/SchoolDataContext'
import { Logomark, Wordmark } from '../../../design-system/components/Logomark'
import { Icon } from '../../../design-system/components/Icon'
import { cn } from '../../../design-system/cn'

export function SchoolTopNav() {
  const { school, logout } = useSchoolData()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-ink-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Logomark className="h-7 w-7" />
            <Wordmark className="text-lg" />
          </div>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink
              to="/school"
              end
              className={({ isActive }) =>
                cn(
                  'rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  isActive ? 'bg-teal-100 text-teal-800' : 'text-ink-500 hover:text-ink-800',
                )
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/school/roster"
              className={({ isActive }) =>
                cn(
                  'rounded-pill px-3.5 py-1.5 text-sm font-semibold transition-colors',
                  isActive ? 'bg-teal-100 text-teal-800' : 'text-ink-500 hover:text-ink-800',
                )
              }
            >
              Roster
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink-500 sm:inline">{school?.shortName}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-pill border border-ink-200 px-3 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-50"
          >
            <Icon name="log-out" className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      </div>

      <nav className="flex items-center gap-1 border-t border-ink-100 px-4 py-2 sm:hidden">
        <NavLink
          to="/school"
          end
          className={({ isActive }) =>
            cn(
              'flex-1 rounded-pill px-3 py-1.5 text-center text-sm font-semibold transition-colors',
              isActive ? 'bg-teal-100 text-teal-800' : 'text-ink-500',
            )
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/school/roster"
          className={({ isActive }) =>
            cn(
              'flex-1 rounded-pill px-3 py-1.5 text-center text-sm font-semibold transition-colors',
              isActive ? 'bg-teal-100 text-teal-800' : 'text-ink-500',
            )
          }
        >
          Roster
        </NavLink>
      </nav>
    </header>
  )
}
