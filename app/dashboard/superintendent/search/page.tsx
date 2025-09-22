'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { Job, ATTENDANCE_TYPES, VESSEL_TYPES, SearchFilters } from '@/types'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPinIcon, CalendarIcon, ClockIcon, UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { SearchPopup } from '@/components/ui/SearchPopup'

export default function SearchJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState<string | null>(null)
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    port_name: '',
    attendance_type: '',
    vessel_type: '',
    date_range: undefined
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) {
        toast.error('Please log in to view jobs')
        return
      }

      let query = supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_manager_id_fkey (
            name,
            surname,
            company,
            email,
            phone,
            photo_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.port_name) {
        query = query.ilike('port_name', `%${filters.port_name}%`)
      }
      if (filters.attendance_type) {
        query = query.eq('attendance_type', filters.attendance_type)
      }
      if (filters.vessel_type) {
        query = query.eq('vessel_type', filters.vessel_type)
      }
      if (filters.date_range) {
        query = query.gte('start_date', filters.date_range.start.toISOString().split('T')[0])
        query = query.lte('end_date', filters.date_range.end.toISOString().split('T')[0])
      }

      const { data: jobsData, error } = await query
      if (error) throw error
      
      if (!jobsData || jobsData.length === 0) {
        setJobs([])
        return
      }

      // Get existing applications for this user
      const jobIds = jobsData.map(job => job.id)
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('job_id, status')
        .in('job_id', jobIds)
        .eq('superintendent_id', user.id)

      if (applicationsError) throw applicationsError

      // Create a map of job_id to application status
      const applicationMap = new Map()
      applicationsData?.forEach(app => {
        applicationMap.set(app.job_id, app.status)
      })

      // Fetch verification status for all managers
      const managerIds = jobsData.map(job => job.manager_id)
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('email_verifications')
        .select('user_id, is_verified')
        .in('user_id', managerIds)

      // Create a map of manager_id to verification status
      const verificationMap = new Map()
      verificationsData?.forEach(verification => {
        verificationMap.set(verification.user_id, verification.is_verified)
      })

      // Add application status and verification status to each job
      const jobsWithApplications = jobsData.map(job => ({
        ...job,
        application_status: applicationMap.get(job.id) || null,
        users: {
          ...job.users,
          email_verifications: verificationMap.get(job.manager_id) ? 
            [{ is_verified: verificationMap.get(job.manager_id) }] : 
            [{ is_verified: false }]
        }
      }))
      
      console.log('Jobs fetched with applications:', jobsWithApplications)
      setJobs(jobsWithApplications)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSearch = () => {
    setShowSearchPopup(true)
    fetchJobs()
  }

  const handleApply = async (jobId: string) => {
    setIsApplying(jobId)
    try {
      const user = await getCurrentUser()
      if (!user) {
        toast.error('Please log in to apply')
        return
      }

      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          superintendent_id: user.id,
          status: 'pending'
        })

      if (error) throw error

      // Create notification for manager
      const job = jobs.find(j => j.id === jobId)
      if (job) {
        await supabase
          .from('notifications')
          .insert({
            user_id: job.manager_id,
            type: 'job_application',
            title: 'New Job Application',
            message: `${user.name} ${user.surname} has applied for your job: ${job.title}`,
            related_id: jobId
          })
      }

      toast.success('Application submitted successfully!')
      
      // Refresh jobs to update application status
      await fetchJobs()
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application')
    } finally {
      setIsApplying(null)
    }
  }

  const clearFilters = () => {
    setFilters({
      port_name: '',
      attendance_type: '',
      vessel_type: '',
      date_range: undefined
    })
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Search Jobs
          </h1>
          <p className="text-gray-400">
            Find marine superintendent opportunities that match your expertise
          </p>
        </div>


        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search Filters</CardTitle>
            <CardDescription>
              Filter jobs by location, service type, vessel type, and date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                label="Port Name"
                value={filters.port_name || ''}
                onChange={(e) => handleFilterChange('port_name', e.target.value)}
                placeholder="e.g., Port of Rotterdam"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Attendance Type
                </label>
                <select
                  value={filters.attendance_type || ''}
                  onChange={(e) => handleFilterChange('attendance_type', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All types</option>
                  {ATTENDANCE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vessel Type
                </label>
                <select
                  value={filters.vessel_type || ''}
                  onChange={(e) => handleFilterChange('vessel_type', e.target.value)}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">All vessels</option>
                  {VESSEL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date Range
                </label>
                <DatePicker
                  selected={filters.date_range?.start}
                  onChange={(date) => handleFilterChange('date_range', date ? {
                    start: date,
                    end: filters.date_range?.end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  } : undefined)}
                  startDate={filters.date_range?.start}
                  endDate={filters.date_range?.end}
                  selectsRange
                  dateFormat="MMM dd, yyyy"
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  placeholderText="Select date range"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Button onClick={handleSearch} className="flex-1">
                Search Jobs
              </Button>
              <Button variant="outline" onClick={clearFilters} className="px-6">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Available Jobs ({jobs.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-400 mb-4">No jobs found matching your criteria</p>
                <p className="text-sm text-gray-500 mb-3">Try adjusting your filters or check back later for new opportunities</p>
                <p className="text-sm text-blue-600 font-medium">💡 Tip: Even if vessel managers haven't posted specific jobs, they can still browse your profile and reach out for potential opportunities!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} variant="elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-2 mb-3">
                          <CardDescription className="text-sm">
                            Posted by {job.users?.name} {job.users?.surname} from {job.users?.company}
                          </CardDescription>
                          {job.users?.email_verifications?.[0]?.is_verified ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ⭐ Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              ⚪ Unverified
                            </span>
                          )}
                        </div>
                        
                        {/* Manager Details */}
                        <div className="flex items-center space-x-3 p-3 bg-dark-800/50 rounded-lg">
                          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            {job.users?.photo_url ? (
                              <img
                                src={job.users.photo_url}
                                alt={`${job.users.name} ${job.users.surname}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-4 text-xs text-gray-300">
                              <div className="flex items-center space-x-1">
                                <EnvelopeIcon className="h-3 w-3 text-gray-400" />
                                <span className="truncate">{job.users?.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <PhoneIcon className="h-3 w-3 text-gray-400" />
                                <span>{job.users?.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {job.port_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {job.attendance_type}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(job.start_date).toLocaleDateString()} - {new Date(job.end_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Vessel: {job.vessel_type}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApply(job.id)}
                      isLoading={isApplying === job.id}
                      disabled={job.application_status === 'pending' || job.application_status === 'accepted' || job.application_status === 'rejected'}
                      className={`w-full ${
                        job.application_status === 'pending' 
                          ? 'bg-yellow-600 hover:bg-yellow-600' 
                          : job.application_status === 'accepted'
                          ? 'bg-green-600 hover:bg-green-600'
                          : job.application_status === 'rejected'
                          ? 'bg-red-600 hover:bg-red-600'
                          : ''
                      }`}
                    >
                      {job.application_status === 'pending' 
                        ? 'Applied' 
                        : job.application_status === 'accepted'
                        ? 'Accepted'
                        : job.application_status === 'rejected'
                        ? 'Rejected'
                        : 'Apply for Job'
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Popup */}
      <SearchPopup 
        isOpen={showSearchPopup} 
        onClose={() => setShowSearchPopup(false)} 
      />
    </DashboardLayout>
  )
}
