'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import { Header } from './Header'
import { NotificationPanel } from './NotificationPanel'
import toast from 'react-hot-toast'

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: 'manager' | 'superintendent'
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push('/auth/login')
          return
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          toast.error('Access denied')
          router.push('/')
          return
        }

        setUser(currentUser)
      } catch (error: any) {
        console.error('Auth error:', error)
        toast.error('Authentication error')
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header
        user={user}
        onNotificationClick={() => setIsNotificationPanelOpen(true)}
        unreadCount={0} // TODO: Implement notification count
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        userId={user.id}
      />
    </div>
  )
}
