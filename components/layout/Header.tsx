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
import toast from 'react-hot-toast'

interface HeaderProps {
  user?: AuthUser | null
  onNotificationClick?: () => void
  unreadCount?: number
  hideNavigation?: boolean
}

export function Header({ user, onNotificationClick, unreadCount, hideNavigation }: HeaderProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const getNavigationItems = () => {
    if (!user) return [
      { name: 'Home', href: '/', icon: HomeIcon, color: 'blue' },
      { name: 'About', href: '/about', icon: UserGroupIcon, color: 'green' },
      { name: 'Services', href: '/services', icon: BriefcaseIcon, color: 'yellow' },
      { name: 'Blog', href: '/blog', icon: DocumentTextIcon, color: 'purple' },
      { name: 'Contact', href: '/contact', icon: UserGroupIcon, color: 'red' },
    ]

    if (user.role === 'manager') {
      return [
          { name: 'Dashboard', href: '/dashboard/manager', icon: HomeIcon, color: 'blue' },
          { name: 'Post Job', href: '/dashboard/manager/post-job', icon: PlusIcon, color: 'green' },
        { name: 'Search Superintendents', href: '/dashboard/manager/search', icon: MagnifyingGlassIcon, color: 'yellow' },
        { name: 'My Posts', href: '/dashboard/manager/my-posts', icon: DocumentTextIcon, color: 'purple' },
        { name: 'Applications', href: '/dashboard/manager/applications', icon: ClipboardDocumentListIcon, color: 'red' },
          ...(user.email === 'kenkadzealex@gmail.com' ? [
            { name: 'Blog Management', href: '/dashboard/blog', icon: DocumentTextIcon, color: 'indigo' },
            { name: 'View Superintendents', href: '/dashboard/admin/superintendents', icon: UserGroupIcon, color: 'teal' }
          ] : []),
        ]
    }

    if (user.role === 'superintendent') {
      return [
          { name: 'Dashboard', href: '/dashboard/superintendent', icon: HomeIcon, color: 'blue' },
          { name: 'Search Jobs', href: '/dashboard/superintendent/search', icon: BriefcaseIcon, color: 'green' },
          { name: 'My Applications', href: '/dashboard/superintendent/applications', icon: ClipboardDocumentListIcon, color: 'red' },
          ...(user.email === 'kenkadzealex@gmail.com' ? [
            { name: 'Blog Management', href: '/dashboard/blog', icon: DocumentTextIcon, color: 'indigo' },
            { name: 'View Superintendents', href: '/dashboard/admin/superintendents', icon: UserGroupIcon, color: 'teal' }
          ] : []),
      ]
    }

    return []
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-300 hover:text-blue-200 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-blue-600/20 hover:shadow-blue-500/20 hover:shadow-lg',
      green: 'text-green-300 hover:text-green-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:shadow-green-500/20 hover:shadow-lg',
      yellow: 'text-yellow-300 hover:text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-yellow-600/20 hover:shadow-yellow-500/20 hover:shadow-lg',
      red: 'text-red-300 hover:text-red-200 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 hover:shadow-red-500/20 hover:shadow-lg',
      purple: 'text-purple-300 hover:text-purple-200 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-purple-600/20 hover:shadow-purple-500/20 hover:shadow-lg',
      indigo: 'text-indigo-300 hover:text-indigo-200 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-indigo-600/20 hover:shadow-indigo-500/20 hover:shadow-lg',
      teal: 'text-teal-300 hover:text-teal-200 hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-teal-600/20 hover:shadow-teal-500/20 hover:shadow-lg',
    }
    return colorMap[color] || colorMap.blue
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={user ? `/dashboard/${user.role}` : '/'} className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-blue-400">Ship</span>
        <span className="text-red-500">in</span>
                <span className="text-blue-400">Port.com</span>
                  </span>
                </Link>
              </div>

          {/* Desktop Navigation */}
          {!hideNavigation && (
            <nav className="hidden md:flex space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm border border-transparent hover:border-current/20 transform hover:scale-105 active:scale-95 ${getColorClasses(item.color)} ${
                      isActive ? 'bg-gradient-to-r from-primary-500/30 to-primary-600/30 text-primary-300 border-primary-400/30 shadow-lg shadow-primary-500/20' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                </Link>
              )
            })}
            </nav>
          )}

          {/* Right side - User menu and notifications */}
          <div className="flex items-center space-x-4">
            {user && (
              <>

                {/* User profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-xl bg-gradient-to-r from-dark-700/50 to-dark-600/50 backdrop-blur-sm border border-dark-600/50 text-white hover:text-gray-100 hover:border-primary-400/50 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95">
                    <div className="flex items-center space-x-2">
                      {user.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={`${user.name} ${user.surname}`}
                          className="h-8 w-8 rounded-full object-cover ring-2 ring-primary-500/30"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold">{user.name} {user.surname}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-3 w-52 bg-gradient-to-b from-dark-700/95 to-dark-800/95 backdrop-blur-md rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-dark-600/50 overflow-hidden">
                    <div className="py-2">
                      <Link
                        href={`/dashboard/${user.role}/profile`}
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/20 hover:text-white transition-all duration-200 hover:translate-x-1"
                      >
                        <UserCircleIcon className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 hover:text-white transition-all duration-200 hover:translate-x-1"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                </div>
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/auth/login">
                  <Button variant="glass" size="sm" className="group relative overflow-hidden min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-2.5">
                    <span className="flex items-center text-sm sm:text-sm">
                      <svg className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden xs:inline">Sign In</span>
                      <span className="xs:hidden">Sign In</span>
                    </span>
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="gradient" size="sm" className="group relative overflow-hidden shadow-lg hover:shadow-primary-500/30 min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-2.5">
                    <span className="flex items-center text-sm sm:text-sm">
                      <svg className="w-4 h-4 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Sign Up
                    </span>
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {!hideNavigation && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-xl bg-gradient-to-r from-dark-700/50 to-dark-600/50 backdrop-blur-sm border border-dark-600/50 text-gray-300 hover:text-white hover:border-primary-400/50 hover:bg-gradient-to-r hover:from-primary-500/20 hover:to-primary-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isMobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
      </div>

      {/* Mobile Navigation */}
        {!hideNavigation && isMobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700/50 bg-gradient-to-b from-dark-800/95 to-dark-900/95 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-current/20 transform hover:scale-105 active:scale-95 ${getColorClasses(item.color)} ${
                      isActive ? 'bg-gradient-to-r from-primary-500/30 to-primary-600/30 text-primary-300 border-primary-400/30 shadow-lg shadow-primary-500/20' : 'hover:bg-gradient-to-r hover:from-dark-700/50 hover:to-dark-600/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
      </div>
    </header>
  )
}
