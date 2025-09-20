'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateUserProfile, updateSuperintendentProfile, uploadProfilePhoto, getCurrentUser } from '@/lib/auth'
import { VESSEL_TYPES, SUPERINTENDENT_SERVICES, CERTIFICATION_TYPES } from '@/types'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AuthUser } from '@/lib/auth'
import { CameraIcon, UserCircleIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface Port {
  id: string
  name: string
  country: string
  city: string
}

export default function SuperintendentProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [ports, setPorts] = useState<Port[]>([])
  const [searchPort, setSearchPort] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    company: '',
    bio: '',
    vesselTypes: [] as string[],
    certifications: [] as string[],
    portsCovered: [] as string[],
    services: [] as string[],
  })

  useEffect(() => {
    loadUserProfile()
    loadPorts()
  }, [])

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setFormData({
          name: currentUser.name,
          surname: currentUser.surname,
          phone: currentUser.phone,
          company: currentUser.company,
          bio: currentUser.bio,
          vesselTypes: [], // TODO: Load from superintendent_profiles table
          certifications: [],
          portsCovered: [],
          services: [],
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPorts = async () => {
    try {
      const { data, error } = await supabase
        .from('ports')
        .select('*')
        .order('name')
        .limit(100)

      if (error) throw error
      setPorts(data || [])
    } catch (error) {
      console.error('Error loading ports:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleMultiSelectChange = (type: 'vesselTypes' | 'certifications' | 'services', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }))
  }

  const handlePortAdd = (port: Port) => {
    const portString = `${port.name}, ${port.city}, ${port.country}`
    if (!formData.portsCovered.includes(portString)) {
      setFormData(prev => ({
        ...prev,
        portsCovered: [...prev.portsCovered, portString]
      }))
    }
    setSearchPort('')
  }

  const handlePortRemove = (port: string) => {
    setFormData(prev => ({
      ...prev,
      portsCovered: prev.portsCovered.filter(p => p !== port)
    }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      const photoUrl = await uploadProfilePhoto(user.id, file)
      await updateUserProfile(user.id, { photo_url: photoUrl })
      setUser(prev => prev ? { ...prev, photo_url: photoUrl } : null)
      toast.success('Photo updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload photo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      await updateUserProfile(user.id, {
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
      })

      await updateSuperintendentProfile(user.id, {
        vesselTypes: formData.vesselTypes,
        certifications: formData.certifications,
        portsCovered: formData.portsCovered,
        services: formData.services,
      })

      setUser(prev => prev ? {
        ...prev,
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
      } : null)

      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredPorts = ports.filter(port =>
    port.name.toLowerCase().includes(searchPort.toLowerCase()) ||
    port.city.toLowerCase().includes(searchPort.toLowerCase()) ||
    port.country.toLowerCase().includes(searchPort.toLowerCase())
  ).slice(0, 10)

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="superintendent">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout requiredRole="superintendent">
        <div className="text-center">
          <p className="text-gray-400">Failed to load profile</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="superintendent">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-400">
            Manage your marine superintendent profile and showcase your expertise
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a professional photo for your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {user.photo_url ? (
                    <img
                      src={user.photo_url}
                      alt={`${user.name} ${user.surname}`}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-24 w-24 text-gray-400" />
                  )}
                  <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {user.name} {user.surname}
                  </h3>
                  <p className="text-gray-400">{user.company}</p>
                  {isUploading && (
                    <p className="text-sm text-primary-400 mt-2">Uploading...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your basic contact and company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Last Name"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Company Name"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your marine experience, expertise, and professional background..."
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Vessel Types */}
          <Card>
            <CardHeader>
              <CardTitle>Vessel Types You Work With</CardTitle>
              <CardDescription>
                Select the types of vessels you have experience with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {VESSEL_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-3 p-3 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.vesselTypes.includes(type)}
                      onChange={() => handleMultiSelectChange('vesselTypes', type)}
                      className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                List your marine industry certifications and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CERTIFICATION_TYPES.map((cert) => (
                  <label key={cert} className="flex items-center space-x-3 p-3 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={() => handleMultiSelectChange('certifications', cert)}
                      className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">{cert}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Services You Provide</CardTitle>
              <CardDescription>
                Select the marine services you offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SUPERINTENDENT_SERVICES.map((service) => (
                  <label key={service} className="flex items-center space-x-3 p-3 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleMultiSelectChange('services', service)}
                      className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ports Covered */}
          <Card>
            <CardHeader>
              <CardTitle>Ports Covered</CardTitle>
              <CardDescription>
                Add ports and regions where you can provide services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Search Ports"
                    value={searchPort}
                    onChange={(e) => setSearchPort(e.target.value)}
                    placeholder="Type to search for ports..."
                  />
                  
                  {searchPort && filteredPorts.length > 0 && (
                    <div className="mt-2 max-h-48 overflow-y-auto border border-dark-600 rounded-lg bg-dark-800">
                      {filteredPorts.map((port) => (
                        <button
                          key={port.id}
                          type="button"
                          onClick={() => handlePortAdd(port)}
                          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-dark-700 hover:text-white transition-colors"
                        >
                          {port.name}, {port.city}, {port.country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.portsCovered.map((port, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      <MapPinIcon className="h-4 w-4" />
                      <span>{port}</span>
                      <button
                        type="button"
                        onClick={() => handlePortRemove(port)}
                        className="ml-1 hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={!formData.name || !formData.surname || !formData.phone || !formData.company || !formData.bio}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
