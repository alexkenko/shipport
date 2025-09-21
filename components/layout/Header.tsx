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
  ArrowRightOnRectangleIcon
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
          { name: 'Dashboard', href: '/dashboard/manager' },
          { name: 'Post Job', href: '/dashboard/manager/post-job' },
          { name: 'My Posts', href: '/dashboard/manager/my-posts' },
          { name: 'Search Superintendents', href: '/dashboard/manager/search' },
        ]
      : [
          { name: 'Dashboard', href: '/dashboard/superintendent' },
          { name: 'Search Jobs', href: '/dashboard/superintendent/search' },
          { name: 'My Applications', href: '/dashboard/superintendent/applications' },
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
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group
                  ${index === 0 
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25' 
                    : 'bg-gradient-to-r from-dark-700/50 to-dark-600/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/10 border border-dark-600/50 hover:border-primary-500/30'
                  }
                  hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20
                `}
              >
                <span className="relative z-10">{item.name}</span>
                {index === 0 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
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

      {/* Click outside to close dropdowns */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
