'use client'

import { useState, useEffect } from 'react'
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
import { MapPinIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function SearchJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState<string | null>(null)
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
      let query = supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_manager_id_fkey (
            name,
            surname,
            company
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

      const { data, error } = await query
      if (error) throw error
      setJobs(data || [])
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

            <div className="flex gap-4">
              <Button onClick={handleSearch} className="flex-1">
                Search Jobs
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
                <p className="text-sm text-gray-500">Try adjusting your filters or check back later for new opportunities</p>
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
                        <CardDescription className="text-sm">
                          Posted by {job.users?.name} {job.users?.surname} from {job.users?.company}
                        </CardDescription>
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
                      className="w-full"
                    >
                      Apply for Job
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
