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
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface HeaderProps {
  user?: AuthUser | null
  onNotificationClick?: () => void
  unreadCount?: number
}

export function Header({ user, onNotificationClick, unreadCount = 0 }: HeaderProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

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
    : [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' },
      ]

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={user ? `/dashboard/${user.role}` : "/"} className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Lighthouse - Dark Blue */}
                  <rect x="8" y="12" width="4" height="12" fill="#1e40af" rx="1"/>
                  <rect x="7" y="10" width="6" height="3" fill="#22d3ee" rx="1"/>
                  <circle cx="10" cy="9" r="1.5" fill="#f59e0b"/>
                  {/* Light rays - Light Teal */}
                  <path d="M10 9 L6 5 M10 9 L14 5 M10 9 L10 2" stroke="#22d3ee" strokeWidth="1"/>
                  {/* Cargo Ship - Dark Blue */}
                  <path d="M18 26 L26 26 L28 28 L30 28 L30 30 L18 30 Z" fill="#1e40af"/>
                  <rect x="20" y="22" width="2" height="4" fill="#22d3ee"/>
                  <rect x="22" y="20" width="2" height="6" fill="#22d3ee"/>
                  <rect x="24" y="18" width="2" height="8" fill="#22d3ee"/>
                  {/* Waves - Dark Blue */}
                  <path d="M12 32 Q16 28 20 32 Q24 36 28 32 Q32 28 36 32" stroke="#1e40af" strokeWidth="2" fill="none"/>
                  {/* Circular Arrow - Light Teal */}
                  <path d="M8 32 A12 12 0 1 1 32 8" stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <polygon points="32,8 36,8 34,4" fill="#22d3ee"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  <span className="text-blue-700">Ship</span>
                  <span className="text-red-500">in</span>
                  <span className="text-cyan-400">Port</span>
                </span>
                <span className="text-xs text-gray-400">.com</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dark-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile auth buttons for non-authenticated users */}
              {!user && (
                <div className="pt-4 border-t border-dark-600">
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mx-3 mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileMenuOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
