'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getCurrentUser, getSuperintendentProfile } from '@/lib/auth'
import { AuthUser } from '@/lib/auth'
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function SuperintendentDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

        {/* Profile Overview & News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>
                Your professional profile summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-1 uppercase tracking-wide">Name</h4>
                    <p className="text-sm text-white">Captain John Smith</p>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-800/30">
                    <h4 className="text-xs font-semibold text-primary-400 mb-1 uppercase tracking-wide">Company</h4>
                    <p className="text-sm text-white">Marine Consulting Ltd.</p>
                  </div>
                </div>

                {/* Certifications & Vessel Types */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Certifications</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">ISM</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">ISPS</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded">MLC</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Vessel Types</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">Container</span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">Bulk</span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">Tanker</span>
                    </div>
                  </div>
                </div>

                {/* Services & Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Services</h4>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded">Pre-Vetting</span>
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded">Audits</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-primary-400 mb-2 uppercase tracking-wide">Rate</h4>
                    <p className="text-sm text-white font-medium">€850/day</p>
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
                  <div className="flex space-x-3 animate-scroll">
                    {[
                      {
                        title: "IMO Adopts New EEXI Guidelines for 2025",
                        source: "Maritime Executive",
                        time: "3h ago",
                        category: "Regulations",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop&crop=center",
                        fallback: "🚢",
                        url: "https://www.maritime-executive.com/article/imo-adopts-new-eexi-guidelines-2025"
                      },
                      {
                        title: "Major Port Strike Averted in Rotterdam",
                        source: "Lloyd's List",
                        time: "7h ago", 
                        category: "Ports",
                        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop&crop=center",
                        fallback: "⚓",
                        url: "https://www.lloydslist.com/news/rotterdam-port-strike-averted"
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
                  <Button variant="outline" size="sm" className="text-xs">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Updated: {new Date().toLocaleTimeString()}
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
