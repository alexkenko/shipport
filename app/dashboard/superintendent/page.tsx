'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function SuperintendentDashboard() {
  const quickActions = [
    {
      title: 'Search for Jobs',
      description: 'Find available marine superintendent positions',
      icon: MagnifyingGlassIcon,
      href: '/dashboard/superintendent/search',
      color: 'bg-primary-600 hover:bg-primary-700',
      iconColor: 'text-white'
    },
    {
      title: 'My Applications',
      description: 'Track your job applications and responses',
      icon: DocumentTextIcon,
      href: '/dashboard/superintendent/applications',
      color: 'bg-marine-600 hover:bg-marine-700',
      iconColor: 'text-white'
    },
    {
      title: 'Update Profile',
      description: 'Keep your certifications and services up to date',
      icon: UserGroupIcon,
      href: '/dashboard/superintendent/profile',
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-white'
    }
  ]

  const stats = [
    { label: 'Applications Sent', value: '8', icon: DocumentTextIcon, color: 'text-blue-400' },
    { label: 'Pending Responses', value: '3', icon: ClockIcon, color: 'text-yellow-400' },
    { label: 'Completed Jobs', value: '15', icon: CheckCircleIcon, color: 'text-green-400' },
    { label: 'Profile Views', value: '42', icon: ChartBarIcon, color: 'text-purple-400' }
  ]

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
                Latest updates on your applications and job opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-dark-800/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'accepted' ? 'bg-green-500' :
                      activity.type === 'job_match' ? 'bg-blue-500' :
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
              <CardTitle>Profile Tips</CardTitle>
              <CardDescription>
                Optimize your superintendent profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-dark-800/50">
                  <h4 className="font-medium text-white mb-2">
                    Complete your certifications
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Add all your marine certifications to increase your visibility to managers.
                  </p>
                  <Button variant="outline" size="sm">
                    Update Certifications
                  </Button>
                </div>
                
                <div className="p-4 rounded-lg bg-dark-800/50">
                  <h4 className="font-medium text-white mb-2">
                    Specify your service areas
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    List all ports and regions where you can provide services.
                  </p>
                  <Button variant="outline" size="sm">
                    Update Service Areas
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
