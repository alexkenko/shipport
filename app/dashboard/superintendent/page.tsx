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

  const recentActivity = [
    {
      id: 1,
      title: 'Application accepted for Port of Hamburg',
      description: 'Your ISM audit application was accepted by ABC Shipping',
      time: '3 hours ago',
      type: 'accepted'
    },
    {
      id: 2,
      title: 'New job matches your profile',
      description: 'Pre-vetting inspection in Rotterdam - Tanker vessel',
      time: '1 day ago',
      type: 'job_match'
    },
    {
      id: 3,
      title: 'Profile viewed by manager',
      description: 'XYZ Marine viewed your profile and certifications',
      time: '2 days ago',
      type: 'profile_view'
    }
  ]

  return (
    <DashboardLayout requiredRole="superintendent">
      {user && <VerificationTip userRole="superintendent" userEmail={user.email} />}
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Superintendent Dashboard
          </h1>
          <p className="text-gray-400">
            Find marine superintendent opportunities and manage your applications
          </p>
        </div>




        {/* Premium Ad Bar */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-yellow-900/30 via-yellow-800/20 to-yellow-900/30 border border-yellow-600/50">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10"></div>
            <div className="relative p-8 text-center">
              <div className="inline-flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-medium text-yellow-200 tracking-wide">
                  Premium Ad Bar
                </h3>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-yellow-300/80 mt-2 font-light">
                Premium advertising space for maritime industry partners
              </p>
            </div>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
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

              {/* Main Content with Vertical Separator */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Professional Info */}
                <div className="col-span-5 space-y-4">
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

                  {/* Services */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Services</h4>
                    <div className="space-y-2">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.services && profile.services.length > 0 ? (
                        profile.services.map((service: string, index: number) => (
                          <div key={index} className="p-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                            <p className="text-xs text-purple-400 font-medium">{service}</p>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No services added</span>
                      )}
                    </div>
                  </div>

                  {/* Ports Covered */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Ports Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.ports_covered && profile.ports_covered.length > 0 ? (
                        profile.ports_covered.map((port: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 text-xs rounded-full border border-orange-500/30 font-medium">
                            {port}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No ports specified</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sexy Vertical Separator */}
                <div className="col-span-1 flex justify-center">
                  <div className="w-px h-full bg-gradient-to-b from-transparent via-primary-500/50 to-transparent"></div>
                </div>

                {/* Right Column - Professional Details */}
                <div className="col-span-6 space-y-4">
                  {/* Bio */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Professional Bio</h4>
                    <div className="p-4 rounded-lg bg-gradient-to-r from-dark-800/50 to-dark-700/30 border border-dark-600/50">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {isLoading ? 'Loading...' : user?.bio || 'No professional bio available'}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Rates</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30">
                        <p className="text-xs text-green-400 uppercase tracking-wide mb-1">Work Day</p>
                        <p className="text-sm text-white font-bold">
                          {isLoading ? 'Loading...' : profile?.price_per_workday ? `$${profile.price_per_workday}/day` : 'Not specified'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-500/30">
                        <p className="text-xs text-blue-400 uppercase tracking-wide mb-1">Idle Day</p>
                        <p className="text-sm text-white font-bold">
                          {isLoading ? 'Loading...' : profile?.price_per_idle_day ? `$${profile.price_per_idle_day}/day` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Service Type</h4>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-900/20 to-indigo-800/10 border border-indigo-500/30">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.service_type ? (
                        <span className="px-3 py-2 bg-indigo-500/20 text-indigo-400 text-sm rounded-lg font-medium border border-indigo-500/30">
                          {profile.service_type === 'door_to_door' ? '🚪 Door to Door Service' : '🛥️ Gangway to Gangway Service'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.certifications && profile.certifications.length > 0 ? (
                        profile.certifications.map((cert: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No certifications added</span>
                      )}
                    </div>
                  </div>

                  {/* Vessel Types */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Vessel Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {isLoading ? (
                        <span className="text-xs text-gray-400">Loading...</span>
                      ) : profile?.vessel_types && profile.vessel_types.length > 0 ? (
                        profile.vessel_types.map((type: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-400 text-xs rounded-full border border-blue-500/30 font-medium">
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No vessel types added</span>
                      )}
                    </div>
                  </div>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
