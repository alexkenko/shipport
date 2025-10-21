'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

export function HomePageContent() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // User not authenticated - that's fine for public pages
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Small delay to prevent hydration issues
    const timer = setTimeout(checkUser, 100)
    return () => clearTimeout(timer)
  }, [])

  // Show loading state briefly to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-8"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-10 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  // If user is logged in, show dashboard access buttons
  if (user) {
    return (
      <div className="text-center">
        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white">
          <div
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold animate-typing"
            style={{animationDelay: '0.2s'}}
          >
            <span className="text-blue-400">Welcome back, {user.name}!</span>
          </div>
          <span
            className="block text-sm sm:text-lg md:text-2xl lg:text-3xl font-normal text-gray-300 mt-2 sm:mt-4 animate-fade-scale"
            style={{animationDelay: '0.8s'}}
          >
            <span className="text-blue-700">Ship</span>
            <span className="text-red-500">in</span>
            <span className="text-blue-700">Port.com</span>
          </span>
        </h1>
        
        <p
          className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto px-2 animate-slide-bottom leading-relaxed"
          style={{animationDelay: '1s'}}
        >
          Access your {user.role === 'manager' ? 'job management' : 'job search'} dashboard and continue your marine career journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-bottom" style={{animationDelay: '1.2s'}}>
          <Link
            href={`/dashboard/${user.role}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 w-full sm:w-auto btn-hover transform hover:scale-105 text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href={`/dashboard/${user.role}/profile`}
            className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 w-full sm:w-auto text-center btn-hover transform hover:scale-105"
          >
            View Profile
          </Link>
        </div>
      </div>
    )
  }

  // If user is not logged in, show sign-up/sign-in buttons
  return (
    <div className="text-center">
      <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white">
        <div
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold animate-typing"
          style={{animationDelay: '0.2s'}}
        >
          <span className="text-blue-400">Marine Consultancy</span>
        </div>
        <span
          className="block text-sm sm:text-lg md:text-2xl lg:text-3xl font-normal text-gray-300 mt-2 sm:mt-4 animate-fade-scale"
          style={{animationDelay: '0.8s'}}
        >
          <span className="text-blue-700">Ship</span>
          <span className="text-red-500">in</span>
          <span className="text-blue-700">Port.com</span>
        </span>
      </h1>
      
      <p
        className="text-xs sm:text-base md:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto px-2 animate-slide-bottom leading-relaxed"
        style={{animationDelay: '1s'}}
      >
        #1 Professional Marine Superintendent and Marine Consultancy Platform. Leading Superintendancy services including vessel inspections, ISM audits, marine consultancy, and maritime consulting worldwide.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-bottom" style={{animationDelay: '1.2s'}}>
        <Link
          href="/auth/register"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 w-full sm:w-auto btn-hover transform hover:scale-105 text-center"
        >
          Create Account
        </Link>
        <Link
          href="/auth/login"
          className="border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-dark-900 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 w-full sm:w-auto text-center btn-hover transform hover:scale-105"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
