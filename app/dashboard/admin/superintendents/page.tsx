'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MagnifyingGlassIcon, UserIcon, BuildingOfficeIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Superintendent {
  id: string
  email: string
  name: string
  surname: string
  phone: string
  company: string
  bio: string
  photo_url?: string
  website?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  created_at: string
  role: string
}

export default function AdminSuperintendentsPage() {
  const [superintendents, setSuperintendents] = useState<Superintendent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchSuperintendents()
  }, [searchTerm, currentPage])

  const fetchSuperintendents = async () => {
    setIsLoading(true)
    try {
      // Get the current user and their token
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        throw new Error('Not authenticated')
      }

      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      if (!token) {
        throw new Error('No access token available')
      }

      const params = new URLSearchParams({
        search: searchTerm,
        page: currentPage.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/superintendents?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch superintendents')
      }

      const data = await response.json()
      setSuperintendents(data.superintendents || [])
      setTotalPages(data.pagination.pages)
      setTotalCount(data.pagination.total)
    } catch (error: any) {
      console.error('Error fetching superintendents:', error)
      toast.error(error.message || 'Failed to load superintendents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchSuperintendents()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getAvailabilityColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800'
      case 'unavailable':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Superintendent Directory</h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-dark-800 p-6 rounded-lg">
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Superintendent Directory</h1>
            <p className="text-gray-300">View all superintendents on the platform ({totalCount} total)</p>
          </div>
        </div>

        {/* Search */}
        <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                />
              </div>
              <Button type="submit" variant="primary">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {superintendents.length === 0 ? (
          <Card className="bg-dark-800/50 backdrop-blur-sm border-dark-700">
            <CardContent className="p-8 text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No superintendents found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'No superintendents have registered yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Superintendent Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {superintendents.map((superintendent) => {
                return (
                  <Card key={superintendent.id} className="bg-dark-800/50 backdrop-blur-sm border-dark-700 hover:border-primary-500/50 transition-colors">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-500/30">
                            {superintendent.photo_url ? (
                              <img
                                src={superintendent.photo_url}
                                alt={`${superintendent.name} ${superintendent.surname}`}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<svg class="h-6 w-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                                  }
                                }}
                              />
                            ) : (
                              <UserIcon className="h-6 w-6 text-primary-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {superintendent.name} {superintendent.surname}
                            </h3>
                            <p className="text-sm text-primary-400 font-medium truncate">
                              {superintendent.company || 'No company specified'}
                            </p>
                          </div>
                        </div>
                        <PremiumBadge 
                          signupDate={superintendent.created_at} 
                          role={superintendent.role}
                          size="sm"
                        />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Contact Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{superintendent.email}</span>
                        </div>
                        {superintendent.phone && (
                          <div className="flex items-center text-sm text-gray-300">
                            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{superintendent.phone}</span>
                          </div>
                        )}
                        {superintendent.website && (
                          <div className="flex items-center text-sm text-gray-300">
                            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <a 
                              href={superintendent.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 truncate"
                            >
                              {superintendent.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Basic Info */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">
                          <span className="font-medium">Role:</span> {superintendent.role}
                        </div>
                      </div>

                      {/* Bio */}
                      {superintendent.bio && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Bio</p>
                          <p className="text-sm text-gray-300 line-clamp-3">
                            {superintendent.bio}
                          </p>
                        </div>
                      )}

                      {/* Join Date */}
                      <div className="flex items-center text-xs text-gray-400 pt-2 border-t border-dark-600">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>Joined {formatDate(superintendent.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-400 px-4">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
