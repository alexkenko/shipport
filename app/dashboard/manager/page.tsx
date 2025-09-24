'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import { 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { getManagerProfile } from '@/lib/auth'
import { VerificationTip } from '@/components/ui/VerificationTip'
import { BlogCarousel } from '@/components/ui/BlogCarousel'

export default function ManagerDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    completedJobs: 0
  })
  const [isLoading, setIsLoading] = useState(true)



  useEffect(() => {
    fetchUserData()
    fetchDashboardStats()
  }, [])

  const fetchUserData = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        // Load manager profile
        const managerProfile = await getManagerProfile(currentUser.id)
        setProfile(managerProfile)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Fetch active jobs count
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user.id)
        .eq('status', 'active')

      // Fetch completed jobs count
      const { count: completedJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user.id)
        .eq('status', 'completed')

      // Fetch total applications count for all jobs by this manager
      const { data: jobs } = await supabase
        .from('jobs')
        .select('id')
        .eq('manager_id', user.id)

      const jobIds = jobs?.map(job => job.id) || []
      
      const { count: applicationsCount } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .in('job_id', jobIds)

      setStats({
        activeJobs: activeJobsCount || 0,
        totalApplications: applicationsCount || 0,
        completedJobs: completedJobsCount || 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    { label: 'Active Jobs', value: stats.activeJobs.toString(), icon: ClockIcon, color: 'text-blue-400' },
    { label: 'Applications', value: stats.totalApplications.toString(), icon: DocumentTextIcon, color: 'text-green-400' },
    { label: 'Completed Jobs', value: stats.completedJobs.toString(), icon: CheckCircleIcon, color: 'text-purple-400' }
  ]

  return (
    <DashboardLayout requiredRole="manager">
      {user && <VerificationTip userRole="manager" userEmail={user.email} />}
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-400">
            Manage your vessel operations and connect with marine superintendents
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-700 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-8 bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsData.map((stat, index) => (
              <Card key={index} variant="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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

                  {/* Company Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Company</h4>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                      <p className="text-sm text-blue-400 font-medium">
                        {isLoading ? 'Loading...' : user?.company || 'No company specified'}
                      </p>
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

                  {/* Job Statistics */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-primary-400 uppercase tracking-wider">Job Statistics</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30 text-center">
                        <p className="text-xs text-green-400 uppercase tracking-wide mb-1">Active</p>
                        <p className="text-sm text-white font-bold">{stats.activeJobs}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-500/30 text-center">
                        <p className="text-xs text-blue-400 uppercase tracking-wide mb-1">Applications</p>
                        <p className="text-sm text-white font-bold">{stats.totalApplications}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-900/20 to-purple-800/10 border border-purple-500/30 text-center">
                        <p className="text-xs text-purple-400 uppercase tracking-wide mb-1">Completed</p>
                        <p className="text-sm text-white font-bold">{stats.completedJobs}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className="pt-4 border-t border-dark-600/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-dark-700/50 to-dark-600/30 border border-dark-600/50 hover:border-primary-500/30 hover:from-primary-500/20 hover:to-primary-600/10"
                  onClick={() => window.location.href = '/dashboard/manager/profile'}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Carousel */}
        <div className="mt-8">
          <BlogCarousel 
            title="Latest Marine Industry Insights" 
            maxPosts={3}
            showViewAll={true}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
