'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { JobApplication } from '@/types'
import toast from 'react-hot-toast'
import { MapPinIcon, CalendarIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ClockIcon as PendingIcon } from '@heroicons/react/24/outline'

interface ApplicationWithJob extends JobApplication {
  jobs: {
    id: string
    title: string
    description: string
    port_name: string
    attendance_type: string
    vessel_type: string
    start_date: string
    end_date: string
    status: string
    users: {
      name: string
      surname: string
      company: string
    }
  }
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMyApplications()
  }, [])

  const fetchMyApplications = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            id,
            title,
            description,
            port_name,
            attendance_type,
            vessel_type,
            start_date,
            end_date,
            status,
            users!jobs_manager_id_fkey (
              name,
              surname,
              company
            )
          )
        `)
        .eq('superintendent_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Filter out applications for deleted jobs
      const validApplications = (data || []).filter(app => app.jobs !== null)
      setApplications(validApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load your applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      setApplications(prev => prev.filter(app => app.id !== applicationId))
      toast.success('Application withdrawn successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to withdraw application')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      case 'pending':
      default:
        return <PendingIcon className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500'
      case 'rejected': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="superintendent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            My Applications
          </h1>
          <p className="text-gray-400">
            Track your job applications and their status
          </p>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="mb-6 md:hidden">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/superintendent">
              <Button variant="outline" className="w-full bg-gradient-to-r from-dark-700/50 to-dark-600/30 border border-dark-600/50 hover:border-primary-500/30 hover:from-primary-500/20 hover:to-primary-600/10">
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard/superintendent/search">
              <Button variant="outline" className="w-full bg-gradient-to-r from-dark-700/50 to-dark-600/30 border border-dark-600/50 hover:border-primary-500/30 hover:from-primary-500/20 hover:to-primary-600/10">
                <span className="text-sm">Search Jobs</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                </div>
                <PendingIcon className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
                <PendingIcon className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Accepted</p>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'accepted').length}
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-white">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
                <XCircleIcon className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <PendingIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
              <p className="text-gray-400 mb-6">Start applying to jobs to see your applications here</p>
              <Button onClick={() => window.location.href = '/dashboard/superintendent/search'}>
                Browse Available Jobs
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application) => (
              <Card key={application.id} variant="elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {application.jobs?.title || 'Job Deleted'}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {application.jobs ? (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">
                          <strong>Company:</strong> {application.jobs.users?.company || 'Not specified'}
                        </p>
                        <p className="text-sm text-gray-400 mb-2">
                          <strong>Contact:</strong> {application.jobs.users?.name || ''} {application.jobs.users?.surname || ''}
                        </p>
                      </div>

                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {application.jobs.description}
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 mb-2">This job has been deleted by the manager</p>
                      <p className="text-sm text-gray-500">Your application is no longer valid</p>
                    </div>
                  )}
                  
                  {application.jobs && (
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {application.jobs.port_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {application.jobs.attendance_type}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(application.jobs.start_date).toLocaleDateString()} - {new Date(application.jobs.end_date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Vessel: {application.jobs.vessel_type}
                      </div>
                    </div>
                  )}

                  {application.message && (
                    <div className="mb-4 p-3 bg-dark-800/50 rounded-lg">
                      <p className="text-sm text-gray-300">
                        <strong>Your message:</strong> {application.message}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Job Status: {application.jobs.status}
                    </div>
                    
                    {application.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.id)}
                      >
                        Withdraw Application
                      </Button>
                    )}
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
