import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FolderOpen, 
  MessageSquare, 
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../contexts/authcontext'
import NHDLogo from '../common/nhdlogo'

const getNavigation = (userRole: string) => {
  if (userRole === 'admin') {
    // Admin users only see Admin Dashboard and Profile
    return [
      { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Profile', href: '/profile', icon: User },
    ]
  } else {
    // Client users see regular dashboard and other sections
    return [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', href: '/profile', icon: User },
      { name: 'My Projects', href: '/projects', icon: FolderOpen },
      { name: 'Team Messages', href: '/messages', icon: MessageSquare },
    ]
  }
}

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  const sidebarContent = (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6">
        <NHDLogo variant="horizontal" size="md" />
      </div>
        
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {getNavigation(user?.role || 'client').map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          onClick={mobile ? onClose : undefined}
                          className={({ isActive }) =>
                            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-primary text-white shadow-md'
                                : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-sm'
                            }`
                          }
                        >
                          <item.icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
            
            <li className="mt-auto">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center space-x-3 px-2">
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    if (mobile && onClose) onClose()
                  }}
                  className="mt-3 w-full flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 dark:text-gray-300 hover:text-accent-500 hover:bg-gradient-to-r hover:from-accent-50 hover:to-red-50 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:shadow-sm transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Sign out
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
  )

  if (mobile) {
    return sidebarContent
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      {sidebarContent}
    </div>
  )
}
