'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import toast from 'react-hot-toast'
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline'

interface ApplicationWithDetails {
  id: string
  job_id: string
  superintendent_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message: string | null
  created_at: string
  updated_at: string
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
  }
  users: {
    id: string
    name: string
    surname: string
    company: string
    bio: string
    photo_url: string | null
  }
  superintendent_profiles: {
    vessel_types: string[]
    certifications: string[]
    ports_covered: string[]
    services: string[]
    price_per_workday: string
    price_per_idle_day: string
    service_type: string
  }[]
}

export default function ManagerApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setIsLoading(true)
    try {
      const user = await getCurrentUser()
      if (!user) return

      // Get all jobs by this manager
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, description, port_name, attendance_type, vessel_type, start_date, end_date, status')
        .eq('manager_id', user.id)

      if (jobsError) throw jobsError

      if (!jobs || jobs.length === 0) {
        setApplications([])
        return
      }

      const jobIds = jobs.map(job => job.id)

      // Get all applications for these jobs
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false })

      if (applicationsError) throw applicationsError

      if (!applications || applications.length === 0) {
        setApplications([])
        return
      }

      // Get superintendent details
      const superintendentIds = applications.map(app => app.superintendent_id)
      const { data: superintendents, error: superintendentsError } = await supabase
        .from('users')
        .select('id, name, surname, company, bio, photo_url')
        .in('id', superintendentIds)

      if (superintendentsError) throw superintendentsError

      // Get superintendent profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('superintendent_profiles')
        .select('user_id, vessel_types, certifications, ports_covered, services, price_per_workday, price_per_idle_day, service_type')
        .in('user_id', superintendentIds)

      if (profilesError) throw profilesError

      // Combine all the data - filter out applications with missing data
      const combinedApplications = applications
        .map(app => {
          const job = jobs.find(j => j.id === app.job_id)
          const superintendent = superintendents?.find(s => s.id === app.superintendent_id)
          const profile = profiles?.find(p => p.user_id === app.superintendent_id)

          return {
            ...app,
            jobs: job,
            users: superintendent,
            superintendent_profiles: profile ? [profile] : []
          }
        })
        .filter(app => app.jobs && app.users) // Only include applications with valid job and user data

      console.log('Debug - Raw applications count:', applications.length)
      console.log('Debug - Jobs found:', jobs.length)
      console.log('Debug - Superintendents found:', superintendents?.length || 0)
      console.log('Debug - Profiles found:', profiles?.length || 0)
      console.log('Debug - Combined applications count:', combinedApplications.length)
      console.log('Debug - Applications with missing data:', applications.filter(app => {
        const job = jobs.find(j => j.id === app.job_id)
        const superintendent = superintendents?.find(s => s.id === app.superintendent_id)
        return !job || !superintendent
      }))

      setApplications(combinedApplications)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ))

      toast.success(`Application ${newStatus}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update application status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      default:
        return <PendingIcon className="h-5 w-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-600'
      case 'rejected':
        return 'bg-red-600'
      default:
        return 'bg-yellow-600'
    }
  }

  const viewProfile = (application: ApplicationWithDetails) => {
    setSelectedApplication(application)
    setShowProfileModal(true)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} variant="glass">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Applications</h1>
            <p className="text-gray-400">Review applications for your posted jobs</p>
          </div>
        </div>

        {/* Applications */}
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <UserIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
              <p className="text-gray-400 mb-6">Applications for your jobs will appear here</p>
              <Button onClick={() => window.location.href = '/dashboard/manager/post-job'}>
                Post a New Job
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
                        {application.jobs?.title || 'Unknown Job'}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Applied by {application.users?.name || 'Unknown'} {application.users?.surname || 'User'}
                      </CardDescription>
                      <CardDescription className="text-xs text-gray-500">
                        {new Date(application.created_at).toLocaleDateString()}
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
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {application.jobs?.port_name || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {application.jobs?.start_date && application.jobs?.end_date 
                        ? `${new Date(application.jobs.start_date).toLocaleDateString()} - ${new Date(application.jobs.end_date).toLocaleDateString()}`
                        : 'N/A'
                      }
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {application.jobs?.attendance_type || 'N/A'} • {application.jobs?.vessel_type || 'N/A'}
                    </div>
                  </div>

                  {application.message && (
                    <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-300">{application.message}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewProfile(application)}
                      className="flex-1"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    
                    {application.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(application.id, 'accepted')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                          className="border-red-500 text-red-400 hover:bg-red-900"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {selectedApplication.users?.name || 'Unknown'} {selectedApplication.users?.surname || 'User'}
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProfileModal(false)}
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      {selectedApplication.users?.photo_url ? (
                        <img
                          src={selectedApplication.users.photo_url}
                          alt={`${selectedApplication.users?.name || 'Unknown'} ${selectedApplication.users?.surname || 'User'}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {selectedApplication.users?.name || 'Unknown'} {selectedApplication.users?.surname || 'User'}
                      </h3>
                      <p className="text-gray-400">{selectedApplication.users?.company || 'No company'}</p>
                      <p className="text-sm text-gray-500 mt-2">{selectedApplication.users?.bio || 'No bio available'}</p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  {selectedApplication.superintendent_profiles?.[0] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">Vessel Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.superintendent_profiles[0].vessel_types?.map((type, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.superintendent_profiles[0].certifications?.map((cert, index) => (
                            <span key={index} className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">Ports Covered</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.superintendent_profiles[0].ports_covered?.map((port, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                              {port}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.superintendent_profiles[0].services?.map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing */}
                  {selectedApplication.superintendent_profiles?.[0] && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-3">Pricing</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Work Day:</span>
                          <span className="text-white ml-2">€{selectedApplication.superintendent_profiles[0].price_per_workday}/day</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Idle Day:</span>
                          <span className="text-white ml-2">€{selectedApplication.superintendent_profiles[0].price_per_idle_day}/day</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400">Service Type:</span>
                          <span className="text-white ml-2">{selectedApplication.superintendent_profiles[0].service_type}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
