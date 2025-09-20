'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
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
                    <div className="flex items-center space-x-4">
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
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>
                Your professional profile and service details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Name</h4>
                    <p className="text-sm text-white">Captain John Smith</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Company</h4>
                    <p className="text-sm text-white">Marine Consulting Ltd.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Experience</h4>
                    <p className="text-sm text-white">15+ Years</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Location</h4>
                    <p className="text-sm text-white">Hamburg, Germany</p>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h4 className="text-xs font-semibold text-primary-400 mb-3 uppercase tracking-wide">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {['ISM Auditor', 'ISPS Lead Auditor', 'MLC Inspector', 'BCAV Certified', 'ISO 9001'].map((cert, index) => (
                      <span key={index} className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vessel Types */}
                <div>
                  <h4 className="text-xs font-semibold text-primary-400 mb-3 uppercase tracking-wide">Vessel Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Container Ships', 'Bulk Carriers', 'Tankers', 'General Cargo', 'Ro-Ro Vessels'].map((type, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="text-xs font-semibold text-primary-400 mb-3 uppercase tracking-wide">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Pre-Vetting Inspections', 'ISM Audits', 'ISPS Audits', 'MLC Inspections', 'Marine Consultancy', 'TMSA Preparation'].map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Port Coverage */}
                <div>
                  <h4 className="text-xs font-semibold text-primary-400 mb-3 uppercase tracking-wide">Port Coverage</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Hamburg', 'Rotterdam', 'Antwerp', 'Singapore', 'Dubai', 'Los Angeles'].map((port, index) => (
                      <span key={index} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded border border-cyan-500/20">
                        {port}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Price per Workday</h4>
                    <p className="text-sm text-white font-medium">€850/day</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Price per Idle Day</h4>
                    <p className="text-sm text-white font-medium">€425/day</p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-800/30 md:col-span-2">
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Service Type</h4>
                    <p className="text-sm text-white font-medium">Door to Door</p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
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

          <Card>
            <CardHeader>
              <CardTitle>Latest Maritime News</CardTitle>
              <CardDescription>
                Stay updated with the latest maritime industry developments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* News Carousel */}
                <div className="relative overflow-hidden">
                  <div className="flex space-x-4 animate-scroll">
                    {/* Sample maritime news items - in production, these would be fetched from APIs */}
                    {[
                      {
                        title: "New IMO Regulations for Carbon Intensity",
                        source: "Maritime Executive",
                        time: "2 hours ago",
                        category: "Regulations",
                        url: "https://www.maritime-executive.com/article/new-imo-carbon-intensity-regulations"
                      },
                      {
                        title: "Container Ship Grounding in Suez Canal",
                        source: "Lloyd's List",
                        time: "4 hours ago", 
                        category: "Incidents",
                        url: "https://www.lloydslist.com/news/container-ship-grounding-suez"
                      },
                      {
                        title: "New Safety Standards for Bulk Carriers",
                        source: "Safety4Sea",
                        time: "6 hours ago",
                        category: "Safety",
                        url: "https://safety4sea.com/bulk-carrier-safety-standards"
                      },
                      {
                        title: "Marine Fuel Price Fluctuations",
                        source: "Bunker World",
                        time: "8 hours ago",
                        category: "Market",
                        url: "https://www.bunkerworld.com/market-update"
                      },
                      {
                        title: "Port Congestion in Major Asian Hubs",
                        source: "Port Technology",
                        time: "10 hours ago",
                        category: "Ports",
                        url: "https://www.porttechnology.org/asian-port-congestion"
                      }
                    ].map((news, index) => (
                      <div key={index} className="flex-shrink-0 w-80">
                        <div className="p-4 rounded-lg bg-dark-800/50 border border-dark-600 hover:border-primary-500 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-primary-400 bg-primary-400/10 px-2 py-1 rounded">
                              {news.category}
                            </span>
                            <span className="text-xs text-gray-500">{news.time}</span>
                          </div>
                          <h4 className="font-medium text-white mb-2 line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-400 mb-3">
                            Source: {news.source}
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
                    ))}
                  </div>
                </div>
                
                {/* Refresh Button */}
                <div className="flex justify-center pt-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Last Updated: {new Date().toLocaleTimeString()}
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
