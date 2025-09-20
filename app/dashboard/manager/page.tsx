'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  PlusIcon, 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function ManagerDashboard() {
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
      title: 'Search Superintendents',
      description: 'Find qualified marine superintendents',
      icon: MagnifyingGlassIcon,
      href: '/dashboard/manager/search',
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-white'
    }
  ]

  const stats = [
    { label: 'Active Jobs', value: '12', icon: ClockIcon, color: 'text-blue-400' },
    { label: 'Applications', value: '45', icon: DocumentTextIcon, color: 'text-green-400' },
    { label: 'Completed Jobs', value: '28', icon: CheckCircleIcon, color: 'text-purple-400' },
    { label: 'Total Superintendents', value: '156', icon: ChartBarIcon, color: 'text-orange-400' }
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
          {stats.map((stat, index) => (
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
          ))}
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
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-400">
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
