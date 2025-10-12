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
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setHasError(false)
      } catch (error) {
        // User not authenticated or error fetching - that's fine for public pages
        console.log('Header: User not authenticated or error fetching user')
        setUser(null)
        setHasError(false) // Don't treat auth errors as fatal
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to prevent hydration issues
    const timer = setTimeout(checkUser, 100)
    return () => clearTimeout(timer)
  }, [])

  // Always render header, even during loading or errors
  return <Header user={isLoading ? null : user} hideNavigation={hideNavigation} />
}
