'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function ManagerDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    completedJobs: 0,
    totalSuperintendents: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const quickActions = [
    {
      title: 'Post a New Job',
      description: 'Create a new job posting for marine superintendent services',
      icon: PlusIcon,
      href: '/dashboard/manager/post-job',
      color: 'bg-primary-600 hover:bg-primary-700',
      iconColor: 'text-white'
    },
    {
      title: 'My Posts',
      description: 'View and manage your job postings',
      icon: DocumentTextIcon,
      href: '/dashboard/manager/my-posts',
      color: 'bg-marine-600 hover:bg-marine-700',
      iconColor: 'text-white'
    },
    {
      title: 'Applications',
      description: 'Review job applications and view profiles',
      icon: UserGroupIcon,
      href: '/dashboard/manager/applications',
      color: 'bg-purple-600 hover:bg-purple-700',
      iconColor: 'text-white'
    },
    {
      title: 'Search Superintendents',
      description: 'Find qualified marine superintendents',
      icon: MagnifyingGlassIcon,
      href: '/dashboard/manager/search',
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-white'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      title: 'New application for Port of Singapore inspection',
      description: 'John Smith applied for your ISM audit job',
      time: '2 hours ago',
      type: 'application'
    },
    {
      id: 2,
      title: 'Job completed: Pre-vetting inspection in Rotterdam',
      description: 'Sarah Johnson completed the inspection successfully',
      time: '1 day ago',
      type: 'completion'
    },
    {
      id: 3,
      title: 'Profile view notification',
      description: 'Michael Brown viewed your profile',
      time: '2 days ago',
      type: 'profile_view'
    }
  ]

  useEffect(() => {
    fetchDashboardStats()
  }, [])

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

      // Fetch total superintendents count
      const { count: superintendentsCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'superintendent')

      setStats({
        activeJobs: activeJobsCount || 0,
        totalApplications: applicationsCount || 0,
        completedJobs: completedJobsCount || 0,
        totalSuperintendents: superintendentsCount || 0
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
    { label: 'Completed Jobs', value: stats.completedJobs.toString(), icon: CheckCircleIcon, color: 'text-purple-400' },
    { label: 'Total Superintendents', value: stats.totalSuperintendents.toString(), icon: ChartBarIcon, color: 'text-orange-400' }
  ]

  return (
    <DashboardLayout requiredRole="manager">
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

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card variant="elevated" className="hover:scale-105 transition-transform duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 h-full">
                      <div className={`p-3 rounded-lg ${action.color} flex-shrink-0`}>
                        <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1 text-center flex flex-col justify-center">
                        <h3 className="font-semibold text-white mb-1">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-tight">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Maritime News */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Maritime News</CardTitle>
            <CardDescription>
              Stay updated with industry developments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* News Carousel */}
              <div className="relative overflow-hidden">
                <div className="flex space-x-4 animate-scroll">
                  {[
                    {
                      title: "IMO Adopts New EEXI Guidelines for 2025",
                      source: "Maritime Executive",
                      time: "3h ago",
                      category: "Regulations",
                      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center",
                      fallback: "🚢",
                        url: "https://www.maritime-executive.com/news/imo-eexi-guidelines-2025"
                    },
                    {
                      title: "Major Port Strike Averted in Rotterdam",
                      source: "Port Technology",
                      time: "7h ago", 
                      category: "Ports",
                      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop&crop=center",
                      fallback: "⚓",
                      url: "https://www.porttechnology.org/rotterdam-port-strike-averted"
                    },
                    {
                      title: "New AI Technology for Vessel Inspection",
                      source: "Safety4Sea",
                      time: "12h ago",
                      category: "Technology",
                      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&crop=center",
                      fallback: "🤖",
                      url: "https://safety4sea.com/ai-vessel-inspection-technology"
                    },
                    {
                      title: "Bunker Fuel Prices Drop 2.5% This Week",
                      source: "Bunker World",
                      time: "18h ago",
                      category: "Market",
                      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop&crop=center",
                      fallback: "⛽",
                      url: "https://www.bunkerworld.com/weekly-price-update"
                    },
                    {
                      title: "Singapore Port Sets New Container Record",
                      source: "Port Technology",
                      time: "24h ago",
                      category: "Ports",
                      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop&crop=center",
                      fallback: "📦",
                      url: "https://www.porttechnology.org/singapore-container-record"
                    },
                    {
                      title: "New Cybersecurity Standards for Ships",
                      source: "Maritime Reporter",
                      time: "32h ago",
                      category: "Security",
                      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop&crop=center",
                      fallback: "🔒",
                      url: "https://www.marinelink.com/news/cybersecurity-standards-ships"
                    }
                  ].map((news, index) => (
                    <div key={index} className="flex-shrink-0 w-80">
                      <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-600 hover:border-primary-500 transition-colors">
                        {/* Category and Time */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-primary-400 bg-primary-400/10 px-2 py-1 rounded">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500">{news.time}</span>
                        </div>
                        
                        {/* Big Image */}
                        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
                          <img 
                            src={news.image} 
                            alt={news.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-full h-full bg-dark-700 flex items-center justify-center text-4xl hidden"
                            style={{ display: 'none' }}
                          >
                            {news.fallback}
                          </div>
                        </div>
                        
                        {/* Headline */}
                        <h4 className="font-semibold text-white text-base line-clamp-2 mb-2">
                          {news.title}
                        </h4>
                        
                        {/* Source and Read More */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {news.source}
                          </p>
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs text-primary-400 hover:text-primary-300 transition-colors"
                          >
                            Read More →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Refresh Button */}
              <div className="flex justify-center pt-1">
                <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
                  🔄 Refresh News
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates on your jobs and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-dark-800/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'application' ? 'bg-green-500' :
                      activity.type === 'completion' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-400 mb-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Get the most out of <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-cyan-400">Port</span><span className="text-gray-400">.com</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-dark-800/50">
                  <h4 className="font-medium text-white mb-2">
                    How to post a job
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Learn how to create effective job postings that attract qualified superintendents.
                  </p>
                  <Button variant="outline" size="sm">
                    Read Guide
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-dark-800/50">
                  <h4 className="font-medium text-white mb-2">
                    Finding the right superintendent
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Tips for selecting the best marine superintendent for your vessel needs.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
