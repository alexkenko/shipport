'use client'

import { useState, useEffect } from 'react'
import { Header } from './Header'
import { getCurrentUser, AuthUser } from '@/lib/auth'

interface HeaderWrapperProps {
  hideNavigation?: boolean
}

export function HeaderWrapper({ hideNavigation = false }: HeaderWrapperProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // User not authenticated, that's fine for public pages
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  if (isLoading) {
    // Show a loading state or the header without user data
    return <Header user={null} hideNavigation={hideNavigation} />
  }

  return <Header user={user} hideNavigation={hideNavigation} />
}
