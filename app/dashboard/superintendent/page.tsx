'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getCurrentUser, getSuperintendentProfile } from '@/lib/auth'
import { AuthUser } from '@/lib/auth'
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { VerificationTip } from '@/components/ui/VerificationTip'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { BlogCarousel } from '@/components/ui/BlogCarousel'
import { ChatPopup } from '@/components/ui/ChatPopup'
import Image from 'next/image'

// Static counter values
const getMockStats = () => {
  return {
    shipManagers: 72,
    completedJobs: 432,
    activeSuperintendents: 54,
  }
}

export default function SuperintendentDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [stats, setStats] = useState(getMockStats())
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        const superintendentProfile = await getSuperintendentProfile(currentUser.id)
        setProfile(superintendentProfile)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="superintendent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="space-y-8">
        {/* Header with Chat Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Superintendent Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.name}! Manage your marine superintendent activities.
            </p>
          </div>
          <Button
            onClick={() => setShowChat(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            Open Chat
          </Button>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-400">Ship Managers</p>
                  <p className="text-3xl font-bold text-white">{stats.shipManagers.toLocaleString()}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-400">Completed Jobs</p>
                  <p className="text-3xl font-bold text-white">{stats.completedJobs.toLocaleString()}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-400">Active Superintendents</p>
                  <p className="text-3xl font-bold text-white">{stats.activeSuperintendents.toLocaleString()}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle className="flex items-center gap-2">
                Profile Overview
                  <PremiumBadge 
                      signupDate={user?.created_at || new Date()} 
                      role={user?.role || 'superintendent'} 
                  />
              </CardTitle>
              <CardDescription>
                Your professional profile summary
              </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {profile ? (
                <div className="space-y-4">
                  {/* Profile Picture and Basic Info */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                  {user?.photo_url ? (
                    <Image
                      src={user.photo_url}
                      alt={`${user.name}'s profile photo`}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNsqgcAAYkBAQTpDPMAAAAASUVORK5CYII="
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                          {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
                        </div>
                  )}
                </div>
                    <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white">
                        {user?.name} {user?.surname}
                    </h3>
                      <p className="text-sm text-gray-400">{user?.company}</p>
                      <p className={`text-sm text-gray-300 mt-1 ${isProfileExpanded ? '' : 'line-clamp-2'}`}>
                        {user?.bio}
                    </p>
                  </div>
                </div>

                  {/* Contact Information - Always visible but compact */}
                    <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">EMAIL:</span>
                      <span className="text-white truncate">{user?.email}</span>
                      </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">PHONE:</span>
                      <span className="text-white">{user?.phone}</span>
                    </div>
                  </div>

                  {/* Expandable Additional Information */}
                  {isProfileExpanded && (
                    <div className="space-y-3 pt-2 border-t border-gray-700">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white text-sm">COMPANY</h4>
                        <p className="text-sm text-gray-300">{user?.company}</p>
                    </div>
                  </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Link href="/dashboard/superintendent/profile">
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                      className="ml-auto"
                    >
                      {isProfileExpanded ? (
                        <>
                          <ChevronUpIcon className="h-4 w-4 mr-1" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon className="h-4 w-4 mr-1" />
                          More
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No profile information available</p>
                  <Link href="/dashboard/superintendent/profile">
                    <Button>Complete Profile</Button>
                  </Link>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Marine Industry Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Latest Marine Industry Insights</CardTitle>
                <Link href="/blog">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <BlogCarousel showViewAll={false} />
            </CardContent>
          </Card>
        </div>


        {/* Verification Tip */}
        <VerificationTip 
          userRole="superintendent" 
          userEmail={user?.email || ''} 
            />
          </div>

      {/* Chat Popup */}
      <ChatPopup 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
        user={user}
      />
    </DashboardLayout>
  )
}