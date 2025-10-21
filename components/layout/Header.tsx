'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { OptimizedLogo } from '@/components/ui/OptimizedLogo'
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
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
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
      blue: 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10',
      green: 'text-green-400 hover:text-green-300 hover:bg-green-400/10',
      yellow: 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10',
      red: 'text-red-400 hover:text-red-300 hover:bg-red-400/10',
      purple: 'text-purple-400 hover:text-purple-300 hover:bg-purple-400/10',
      indigo: 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10',
      teal: 'text-teal-400 hover:text-teal-300 hover:bg-teal-400/10',
    }
    return colorMap[color] || colorMap.blue
  }

  const navigationItems = getNavigationItems()

  return (
    <header className="border-b sticky top-0 z-50" style={{ backgroundColor: '#00315F', borderColor: '#002A4F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <OptimizedLogo 
              href={user ? `/dashboard/${user.role}` : '/'} 
              width={75} 
              height={75} 
              priority={true}
            />
          </div>

          {/* Desktop Navigation */}
          {!hideNavigation && (
            <nav className="hidden md:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${getColorClasses(item.color)} ${
                      isActive ? 'bg-primary-600/20 text-primary-400' : ''
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
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen((v) => !v)}
                    aria-expanded={isProfileOpen}
                    aria-haspopup="menu"
                    className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      {user.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={`${user.name} ${user.surname}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium">{user.name} {user.surname}</p>
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </button>

                  {/* Dropdown menu - tap friendly */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 min-w-[13rem] bg-dark-700 rounded-md shadow-lg border border-dark-600 z-50">
                      <div className="py-1">
                        <Link
                          href={`/dashboard/${user.role}/profile`}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 hover:text-white transition-colors whitespace-nowrap"
                        >
                          <UserCircleIcon className="h-4 w-4 mr-3" />
                          Profile
                        </Link>
                        <button
                          onClick={() => { setIsProfileOpen(false); handleSignOut() }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 hover:text-white transition-colors whitespace-nowrap"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!user && (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="shrink-0">
                  <Button variant="outline" size="sm" className="px-3 py-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="shrink-0">
                  <Button size="sm" className="px-3 py-2">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {!hideNavigation && (
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
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
          <div className="md:hidden border-t border-dark-700 bg-dark-800/95 backdrop-blur-sm">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${getColorClasses(item.color)} ${
                      isActive ? 'bg-primary-600/20 text-primary-400' : 'hover:bg-dark-700/50'
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
