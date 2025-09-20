'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { ATTENDANCE_TYPES, VESSEL_TYPES } from '@/types'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    port_name: '',
    attendance_type: '',
    vessel_type: '',
    start_date: new Date(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDateChange = (field: 'start_date' | 'end_date', date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await getCurrentUser()
      if (!user) {
        toast.error('Please log in to post a job')
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          manager_id: user.id,
          title: formData.title,
          description: formData.description,
          port_name: formData.port_name,
          attendance_type: formData.attendance_type,
          vessel_type: formData.vessel_type,
          start_date: formData.start_date.toISOString().split('T')[0],
          end_date: formData.end_date.toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Job posted successfully!')
      router.push('/dashboard/manager/my-posts')
    } catch (error: any) {
      toast.error(error.message || 'Failed to post job')
    } finally {
      setIsLoading(false)
    }
  }

  const canSubmit = formData.title && formData.description && formData.port_name && 
                   formData.attendance_type && formData.vessel_type

  return (
    <DashboardLayout requiredRole="manager">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Post a New Job
          </h1>
          <p className="text-gray-400">
            Create a job posting to find qualified marine superintendents
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Provide detailed information about the marine superintendent services you need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., ISM Audit for Bulk Carrier"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about the services required, vessel specifications, and any special requirements..."
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Port Name
                  </label>
                  <input
                    name="port_name"
                    value={formData.port_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Port of Rotterdam"
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type of Attendance Needed
                  </label>
                  <select
                    name="attendance_type"
                    value={formData.attendance_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    required
                  >
                    <option value="">Select attendance type</option>
                    {ATTENDANCE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type of Vessel
                </label>
                <select
                  name="vessel_type"
                  value={formData.vessel_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  required
                >
                  <option value="">Select vessel type</option>
                  {VESSEL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.start_date}
                    onChange={(date) => handleDateChange('start_date', date)}
                    dateFormat="MMM dd, yyyy"
                    minDate={new Date()}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholderText="Select start date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.end_date}
                    onChange={(date) => handleDateChange('end_date', date)}
                    dateFormat="MMM dd, yyyy"
                    minDate={formData.start_date}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholderText="Select end date"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  isLoading={isLoading}
                  disabled={!canSubmit}
                >
                  Post Job
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips for Effective Job Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-dark-800/50">
                <h4 className="font-medium text-white mb-2">
                  Be Specific About Requirements
                </h4>
                <p className="text-sm text-gray-400">
                  Clearly state the type of inspection or service needed, vessel specifications, and any special certifications required.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-dark-800/50">
                <h4 className="font-medium text-white mb-2">
                  Provide Context
                </h4>
                <p className="text-sm text-gray-400">
                  Include information about your company, the purpose of the service, and any time-sensitive requirements.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-dark-800/50">
                <h4 className="font-medium text-white mb-2">
                  Set Realistic Timeframes
                </h4>
                <p className="text-sm text-gray-400">
                  Allow sufficient time for superintendents to review your posting and prepare for the assignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
