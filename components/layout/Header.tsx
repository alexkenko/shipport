'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { AuthUser } from '@/lib/auth'
import { 
  BellIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon,
  PlusIcon,
  DocumentTextIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { NotificationDropdown } from '@/components/ui/NotificationDropdown'
import { useNotifications } from '@/hooks/useNotifications'
import { useManagerNotifications } from '@/hooks/useManagerNotifications'
import { ManagerNotificationDropdown } from '@/components/ui/ManagerNotificationDropdown'
import toast from 'react-hot-toast'

interface HeaderProps {
  user?: AuthUser | null
  onNotificationClick?: () => void
  unreadCount?: number
  hideNavigation?: boolean
}

export function Header({ user, onNotificationClick, unreadCount = 0, hideNavigation = false }: HeaderProps) {
  const router = useRouter()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Use notifications hook for superintendents
  const {
    notifications,
    unreadCount: notificationUnreadCount,
    isLoading: notificationsLoading,
    markAsRead,
    markAllAsRead
  } = useNotifications(user || null)

  // Use notifications hook for managers
  const {
    notifications: managerNotifications,
    unreadCount: managerUnreadCount,
    isLoading: managerNotificationsLoading,
    markAsRead: managerMarkAsRead,
    markAllAsRead: managerMarkAllAsRead
  } = useManagerNotifications(user || null)

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Successfully logged out')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout')
    }
  }

  const navigation = user 
    ? (user.role === 'manager' 
      ? [
          { name: 'Dashboard', href: '/dashboard/manager', icon: HomeIcon, color: 'blue' },
          { name: 'Post Job', href: '/dashboard/manager/post-job', icon: PlusIcon, color: 'green' },
          { name: 'My Posts', href: '/dashboard/manager/my-posts', icon: DocumentTextIcon, color: 'yellow' },
          { name: 'Applications', href: '/dashboard/manager/applications', icon: UserGroupIcon, color: 'red' },
          { name: 'Search Superintendents', href: '/dashboard/manager/search', icon: MagnifyingGlassIcon, color: 'purple' },
        ]
      : [
          { name: 'Dashboard', href: '/dashboard/superintendent', icon: HomeIcon, color: 'blue' },
          { name: 'Search Jobs', href: '/dashboard/superintendent/search', icon: BriefcaseIcon, color: 'green' },
          { name: 'My Applications', href: '/dashboard/superintendent/applications', icon: ClipboardDocumentListIcon, color: 'red' },
        ])
    : []

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
              <div className="flex items-center">
                <Link href={user ? `/dashboard/${user.role}` : "/"} className="flex flex-col">
                  <span className="text-xl font-bold text-white">
                    <span className="text-cyan-400">Ship</span>
                    <span className="text-red-500">in</span>
                    <span className="text-cyan-400">Port</span>
                  </span>
                  <span className="text-xs text-cyan-400">.com</span>
                </Link>
              </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navigation.map((item, index) => {
              // Define color schemes for each navigation item
              const getColorClasses = (color: string, isActive: boolean) => {
                const baseClasses = 'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group flex items-center space-x-2 hover:scale-105 hover:shadow-lg'
                
                console.log(`getColorClasses called with color: ${color}, isActive: ${isActive}`)
                
                switch (color) {
                  case 'blue':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-blue-700/30 to-blue-600/20 text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-blue-600/20 border border-blue-600/30 hover:border-blue-500/50 hover:shadow-blue-500/20'
                    }`
                  case 'green':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-r from-green-700/30 to-green-600/20 text-green-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-600/20 border border-green-600/30 hover:border-green-500/50 hover:shadow-green-500/20'
                    }`
                  case 'yellow':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-500/25' 
                        : 'bg-gradient-to-r from-yellow-700/30 to-yellow-600/20 text-yellow-200 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-yellow-600/20 border border-yellow-600/30 hover:border-yellow-500/50 hover:shadow-yellow-500/20'
                    }`
                  case 'red':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25' 
                        : 'bg-gradient-to-r from-red-700/30 to-red-600/20 text-red-200 hover:text-white hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/20 border border-red-600/30 hover:border-red-500/50 hover:shadow-red-500/20'
                    }`
                  case 'purple':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
                        : 'bg-gradient-to-r from-purple-700/30 to-purple-600/20 text-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-purple-600/20 border border-purple-600/30 hover:border-purple-500/50 hover:shadow-purple-500/20'
                    }`
                  default:
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25' 
                        : 'bg-gradient-to-r from-dark-700/50 to-dark-600/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/10 border border-dark-600/50 hover:border-primary-500/30 hover:shadow-primary-500/20'
                    }`
                }
              }

              const getIconColor = (color: string, isActive: boolean) => {
                if (isActive) return 'text-white'
                switch (color) {
                  case 'blue': return 'text-blue-400 group-hover:text-white'
                  case 'green': return 'text-green-400 group-hover:text-white'
                  case 'yellow': return 'text-yellow-400 group-hover:text-white'
                  case 'red': return 'text-red-400 group-hover:text-white'
                  case 'purple': return 'text-purple-400 group-hover:text-white'
                  default: return 'text-gray-400 group-hover:text-white'
                }
              }

              const isActive = index === 0 // Dashboard is always active
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={getColorClasses(item.color, isActive)}
                >
                  <item.icon className={`h-4 w-4 ${getIconColor(item.color, isActive)}`} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${
                      item.color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
                      item.color === 'green' ? 'from-green-500/20 to-green-600/20' :
                      item.color === 'yellow' ? 'from-yellow-500/20 to-yellow-600/20' :
                      item.color === 'red' ? 'from-red-500/20 to-red-600/20' :
                      item.color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
                      'from-primary-500/20 to-primary-600/20'
                    } rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    item.color === 'blue' ? 'from-blue-500/10 to-blue-600/5' :
                    item.color === 'green' ? 'from-green-500/10 to-green-600/5' :
                    item.color === 'yellow' ? 'from-yellow-500/10 to-yellow-600/5' :
                    item.color === 'red' ? 'from-red-500/10 to-red-600/5' :
                    item.color === 'purple' ? 'from-purple-500/10 to-purple-600/5' :
                    'from-primary-500/10 to-primary-600/5'
                  } rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            {user && navigation.length > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200 relative z-50"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            )}
            
            {user ? (
              <>
                {/* Notifications */}
                {user?.role === 'superintendent' ? (
                  <NotificationDropdown
                    notifications={notifications}
                    unreadCount={notificationUnreadCount}
                    isLoading={notificationsLoading}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                  />
                ) : user?.role === 'manager' ? (
                  <ManagerNotificationDropdown
                    notifications={managerNotifications}
                    unreadCount={managerUnreadCount}
                    isLoading={managerNotificationsLoading}
                    onMarkAsRead={managerMarkAsRead}
                    onMarkAllAsRead={managerMarkAllAsRead}
                  />
                ) : (
                  <button
                    onClick={onNotificationClick}
                    className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {user.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8" />
                    )}
                    <span className="hidden md:block text-sm font-medium">
                      {user.name} {user.surname}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-md shadow-lg border border-dark-700 py-1 z-50">
                      <Link
                        href={`/dashboard/${user.role}/profile`}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3" />
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Auth buttons for non-authenticated users */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>

      </div>

      {/* Mobile Navigation */}
      {user && navigation.length > 0 && isMobileMenuOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700 relative z-50">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item, index) => {
              // Define mobile color schemes for each navigation item
              const getMobileColorClasses = (color: string, isActive: boolean) => {
                const baseClasses = 'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative z-50'
                
                switch (color) {
                  case 'blue':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border border-blue-500/50' 
                        : 'bg-gradient-to-r from-blue-700/30 to-blue-600/20 text-blue-200 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-blue-600/20 border border-blue-600/30 hover:border-blue-500/50'
                    }`
                  case 'green':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25 border border-green-500/50' 
                        : 'bg-gradient-to-r from-green-700/30 to-green-600/20 text-green-200 hover:text-white hover:bg-gradient-to-r hover:from-green-500/30 hover:to-green-600/20 border border-green-600/30 hover:border-green-500/50'
                    }`
                  case 'yellow':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-500/25 border border-yellow-500/50' 
                        : 'bg-gradient-to-r from-yellow-700/30 to-yellow-600/20 text-yellow-200 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-yellow-600/20 border border-yellow-600/30 hover:border-yellow-500/50'
                    }`
                  case 'red':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25 border border-red-500/50' 
                        : 'bg-gradient-to-r from-red-700/30 to-red-600/20 text-red-200 hover:text-white hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/20 border border-red-600/30 hover:border-red-500/50'
                    }`
                  case 'purple':
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 border border-purple-500/50' 
                        : 'bg-gradient-to-r from-purple-700/30 to-purple-600/20 text-purple-200 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-purple-600/20 border border-purple-600/30 hover:border-purple-500/50'
                    }`
                  default:
                    return `${baseClasses} ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25 border border-primary-500/50' 
                        : 'bg-gradient-to-r from-dark-700/50 to-dark-600/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/10 border border-dark-600/50 hover:border-primary-500/30'
                    }`
                }
              }

              const getMobileIconColor = (color: string, isActive: boolean) => {
                if (isActive) return 'text-white'
                switch (color) {
                  case 'blue': return 'text-blue-400 group-hover:text-white'
                  case 'green': return 'text-green-400 group-hover:text-white'
                  case 'yellow': return 'text-yellow-400 group-hover:text-white'
                  case 'red': return 'text-red-400 group-hover:text-white'
                  case 'purple': return 'text-purple-400 group-hover:text-white'
                  default: return 'text-gray-400 group-hover:text-white'
                }
              }

              const isActive = index === 0 // Dashboard is always active
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={getMobileColorClasses(item.color, isActive)}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    // Use setTimeout to ensure state update completes before navigation
                    setTimeout(() => {
                      window.location.href = item.href;
                    }, 100);
                  }}
                >
                  <item.icon className={`h-5 w-5 ${getMobileIconColor(item.color, isActive)}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isProfileMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            // Only close if clicking on the backdrop, not on menu items
            if (e.target === e.currentTarget) {
              setIsProfileMenuOpen(false)
              setIsMobileMenuOpen(false)
            }
          }}
        />
      )}
    </header>
  )
}
