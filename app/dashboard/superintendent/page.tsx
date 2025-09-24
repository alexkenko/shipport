'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getCurrentUser, getSuperintendentProfile } from '@/lib/auth'
import { AuthUser } from '@/lib/auth'
import { 
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { VerificationTip } from '@/components/ui/VerificationTip'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { BlogCarousel } from '@/components/ui/BlogCarousel'

export default function SuperintendentDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        // Load superintendent profile
        const superintendentProfile = await getSuperintendentProfile(currentUser.id)
        setProfile(superintendentProfile)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-6">Superintendent Dashboard</h1>

        {user && !user.email_verified && (
          <VerificationTip email={user.email} />
        )}

        {/* Main Dashboard Grid - Profile and Blog Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Profile Overview
                {user && (
                  <PremiumBadge 
                    signupDate={user.created_at} 
                    role={user.role}
                    size="sm"
                  />
                )}
              </CardTitle>
              <CardDescription>
                Your professional profile summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Profile Photo Header */}
                <div className="flex items-center space-x-4 pb-4 border-b border-gradient-to-r from-primary-500/20 to-transparent">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/30">
                    {user?.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={`${user.name} ${user.surname}`}
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<svg class="h-8 w-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                          }
                        }}
                      />
                    ) : (
                      <svg className="h-8 w-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {isLoading ? 'Loading...' : user ? `${user.name} ${user.surname}` : 'Profile'}
                    </h3>
                    <p className="text-sm text-primary-400 font-medium">
                      {isLoading ? 'Loading...' : user?.company || 'No company specified'}
                    </p>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Contact</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-dark-800/50 to-dark-700/30 border border-dark-600/50">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
                        <p className="text-sm text-white font-medium">
                          {isLoading ? 'Loading...' : user?.email || 'Not available'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-r from-dark-800/50 to-dark-700/30 border border-dark-600/50">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-sm text-white font-medium">
                          {isLoading ? 'Loading...' : user?.phone || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Company</h4>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                      <p className="text-sm text-blue-400 font-medium">
                        {isLoading ? 'Loading...' : user?.company || 'No company specified'}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Professional Bio</h4>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-dark-800/50 to-dark-700/30 border border-dark-600/50">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {isLoading ? 'Loading...' : user?.bio || 'No professional bio available'}
                      </p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.services && profile.services.length > 0 ? (
                        profile.services.map((service: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No services listed</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-1">
                    <Link href="/dashboard/superintendent/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blog Carousel */}
          <div className="flex flex-col">
            <BlogCarousel 
              title="Latest Marine Industry Insights" 
              maxPosts={3}
              showViewAll={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}