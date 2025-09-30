import { Menu, Bell, Search, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user } = useAuth()
  const [, setSidebarOpen] = useState(false)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <a 
            href="/" 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 rounded-md transition-all duration-300 hover:shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Back to Website
          </a>
          
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-all duration-300">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile dropdown */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.company}</p>
            </div>
            {user?.avatar ? (
              <img
                className="h-8 w-8 rounded-full border-2 border-primary-100 hover:border-primary-300 transition-colors duration-300"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center border-2 border-primary-100 hover:border-primary-300 transition-colors duration-300">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
