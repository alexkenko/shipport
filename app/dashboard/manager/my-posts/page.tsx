'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { Job } from '@/types'
import toast from 'react-hot-toast'
import { MapPinIcon, CalendarIcon, ClockIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline'

interface JobWithApplications extends Job {
  applications_count: number
  users: {
    name: string
    surname: string
    company: string
  }
}

export default function MyPostsPage() {
  const [jobs, setJobs] = useState<JobWithApplications[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMyPosts()
  }, [])

  const fetchMyPosts = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          users!jobs_manager_id_fkey (
            name,
            surname,
            company
          )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get application counts for each job
      const jobsWithCounts = await Promise.all(
        (data || []).map(async (job) => {
          const { count } = await supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id)

          return {
            ...job,
            applications_count: count || 0
          }
        })
      )

      console.log('Fetched jobs after deletion:', jobsWithCounts)
      setJobs(jobsWithCounts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to load your posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (jobId: string, newStatus: 'active' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId)

      if (error) throw error

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ))

      toast.success(`Job status updated to ${newStatus}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update job status')
    }
  }

  const handleDeleteJob = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return
    }

    try {
      // First delete all applications for this job
      const { error: applicationsError } = await supabase
        .from('job_applications')
        .delete()
        .eq('job_id', jobId)

      if (applicationsError) throw applicationsError

      // Then delete the job
      const { error: jobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)

      if (jobError) throw jobError

      toast.success('Job deleted successfully')
      
      // Refresh the data to ensure consistency with database
      console.log('Refreshing jobs after deletion...')
      await fetchMyPosts()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="manager">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="manager">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            My Job Posts
          </h1>
          <p className="text-gray-400">
            Manage your job postings and track applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Posts</p>
                  <p className="text-2xl font-bold text-white">
                    {jobs.filter(job => job.status === 'active').length}
                  </p>
                </div>
                <ClockIcon className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {jobs.filter(job => job.status === 'completed').length}
                  </p>
                </div>
                <CalendarIcon className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-white">
                    {jobs.reduce((sum, job) => sum + job.applications_count, 0)}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Posts */}
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No job posts yet</h3>
              <p className="text-gray-400 mb-6">Create your first job posting to start finding qualified superintendents</p>
              <Button onClick={() => window.location.href = '/dashboard/manager/post-job'}>
                Post Your First Job
              </Button>
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
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
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

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {job.applications_count} application{job.applications_count !== 1 ? 's' : ''}
                    </div>
                    
                    <div className="flex space-x-2">
                      {job.status === 'active' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(job.id, 'completed')}
                          >
                            Mark Completed
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(job.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {job.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(job.id, 'active')}
                          >
                            Reactivate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="border-red-500 text-red-400 hover:bg-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {job.status === 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="border-red-500 text-red-400 hover:bg-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
