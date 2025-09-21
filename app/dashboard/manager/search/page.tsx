'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { VESSEL_TYPES, SUPERINTENDENT_SERVICES, CERTIFICATION_TYPES } from '@/types'
import toast from 'react-hot-toast'
import { MapPinIcon, UserCircleIcon, CheckBadgeIcon, StarIcon } from '@heroicons/react/24/outline'

interface SuperintendentProfile {
  id: string
  user_id: string
  vessel_types: string[]
  certifications: string[]
  ports_covered: string[]
  services: string[]
  users: {
    id: string
    name: string
    surname: string
    email: string
    phone: string
    company: string
    bio: string
    photo_url: string | null
  }
}

export default function SearchSuperintendentsPage() {
  const [superintendents, setSuperintendents] = useState<SuperintendentProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingInterest, setIsSendingInterest] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    vessel_type: '',
    service: '',
    certification: '',
    port: '',
  })

  useEffect(() => {
    fetchSuperintendents()
  }, [])

  const fetchSuperintendents = async () => {
    setIsLoading(true)
    try {
      // Get all superintendents with their profiles using the same approach as working superintendent search
      const { data: allSuperintendents, error: usersError } = await supabase
        .from('superintendent_profiles')
        .select(`
          *,
          users!superintendent_profiles_user_id_fkey (
            id,
            name,
            surname,
            email,
            phone,
            company,
            bio,
            photo_url,
            role
          )
        `)
        .eq('users.role', 'superintendent')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError
      
      console.log('All superintendents from DB:', allSuperintendents)

      // Filter the results based on profile criteria
      let filteredSuperintendents = allSuperintendents || []

      if (filters.vessel_type && filters.vessel_type.trim() !== '') {
        filteredSuperintendents = filteredSuperintendents.filter(sup => 
          sup.vessel_types?.includes(filters.vessel_type)
        )
      }
      if (filters.service && filters.service.trim() !== '') {
        filteredSuperintendents = filteredSuperintendents.filter(sup => 
          sup.services?.includes(filters.service)
        )
      }
      if (filters.certification && filters.certification.trim() !== '') {
        filteredSuperintendents = filteredSuperintendents.filter(sup => 
          sup.certifications?.includes(filters.certification)
        )
      }
      if (filters.port && filters.port.trim() !== '') {
        filteredSuperintendents = filteredSuperintendents.filter(sup => 
          sup.ports_covered?.includes(filters.port)
        )
      }

      // Transform the data to match the expected interface
      const transformedData = filteredSuperintendents.map(sup => ({
        id: sup.id,
        user_id: sup.user_id,
        vessel_types: sup.vessel_types || [],
        certifications: sup.certifications || [],
        ports_covered: sup.ports_covered || [],
        services: sup.services || [],
        users: {
          id: sup.users.id,
          name: sup.users.name,
          surname: sup.users.surname,
          email: sup.users.email,
          phone: sup.users.phone,
          company: sup.users.company,
          bio: sup.users.bio,
          photo_url: sup.users.photo_url
        }
      }))

      console.log('Filtered superintendents:', filteredSuperintendents)
      console.log('Transformed data:', transformedData)
      setSuperintendents(transformedData)
    } catch (error) {
      console.error('Error fetching superintendents:', error)
      toast.error('Failed to load superintendents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSearch = () => {
    fetchSuperintendents()
  }

  const clearFilters = () => {
    setFilters({
      vessel_type: '',
      service: '',
      certification: '',
      port: '',
    })
  }

  const handleSendInterest = async (superintendentId: string) => {
    setIsSendingInterest(superintendentId)
    try {
      const user = await getCurrentUser()
      if (!user) {
        toast.error('Please log in to send interest')
        return
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: superintendentId,
          type: 'job_interest',
          title: 'Manager Interest',
          message: `${user.name} ${user.surname} from ${user.company} is interested in your services`,
          related_id: user.id
        })

      if (error) throw error

      toast.success('Interest sent successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send interest')
    } finally {
      setIsSendingInterest(null)
    }
  }

  return (
    <DashboardLayout requiredRole="manager">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Superintendents
          </h1>
          <p className="text-gray-400">
            Find qualified marine superintendents for your vessel needs
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>
              Filter superintendents by their expertise and service areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vessel Type
                </label>
                <select
                  value={filters.vessel_type}
                  onChange={(e) => handleFilterChange('vessel_type', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All vessel types</option>
                  {VESSEL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Type
                </label>
                <select
                  value={filters.service}
                  onChange={(e) => handleFilterChange('service', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All services</option>
                  {SUPERINTENDENT_SERVICES.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Certification
                </label>
                <select
                  value={filters.certification}
                  onChange={(e) => handleFilterChange('certification', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All certifications</option>
                  {CERTIFICATION_TYPES.map((cert) => (
                    <option key={cert} value={cert}>{cert}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Port/City"
                value={filters.port}
                onChange={(e) => handleFilterChange('port', e.target.value)}
                placeholder="e.g., Rotterdam"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSearch} className="flex-1">
                Search Superintendents
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Available Superintendents ({superintendents.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : superintendents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserCircleIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No superintendents found matching your criteria</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or check back later</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {superintendents.map((superintendent) => (
                <Card key={superintendent.id} variant="elevated">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      {superintendent.users.photo_url ? (
                        <img
                          src={superintendent.users.photo_url}
                          alt={`${superintendent.users.name} ${superintendent.users.surname}`}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-16 w-16 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {superintendent.users.name} {superintendent.users.surname}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {superintendent.users.company}
                        </CardDescription>
                        <div className="text-xs text-gray-500 mt-1">
                          <div>{superintendent.users.email}</div>
                          <div>{superintendent.users.phone}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {superintendent.users.bio}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {superintendent.certifications.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <CheckBadgeIcon className="h-4 w-4 mr-1" />
                            Certifications
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {superintendent.certifications.slice(0, 3).map((cert, index) => (
                              <span key={index} className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                                {cert}
                              </span>
                            ))}
                            {superintendent.certifications.length > 3 && (
                              <span className="bg-dark-600 text-gray-300 text-xs px-2 py-1 rounded">
                                +{superintendent.certifications.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {superintendent.services.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Services</h4>
                          <div className="flex flex-wrap gap-1">
                            {superintendent.services.slice(0, 2).map((service, index) => (
                              <span key={index} className="bg-marine-600 text-white text-xs px-2 py-1 rounded">
                                {service}
                              </span>
                            ))}
                            {superintendent.services.length > 2 && (
                              <span className="bg-dark-600 text-gray-300 text-xs px-2 py-1 rounded">
                                +{superintendent.services.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {superintendent.ports_covered.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            Service Areas
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {superintendent.ports_covered.slice(0, 2).map((port, index) => (
                              <span key={index} className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                {port}
                              </span>
                            ))}
                            {superintendent.ports_covered.length > 2 && (
                              <span className="bg-dark-600 text-gray-300 text-xs px-2 py-1 rounded">
                                +{superintendent.ports_covered.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleSendInterest(superintendent.users.id)}
                      isLoading={isSendingInterest === superintendent.users.id}
                      className="w-full"
                    >
                      Send Interest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
