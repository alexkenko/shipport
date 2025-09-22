'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateUserProfile, updateManagerProfile, uploadProfilePhoto, getCurrentUser, getManagerProfile } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { VESSEL_TYPES } from '@/types'
import toast from 'react-hot-toast'
import { AuthUser } from '@/lib/auth'
import { CameraIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { EmailVerification } from '@/components/ui/EmailVerification'

export default function ManagerProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    company: '',
    bio: '',
    website: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    vesselTypes: [] as string[],
  })

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        // Load extended manager profile data
        const managerProfile = await getManagerProfile(currentUser.id)
        
        setFormData({
          name: currentUser.name,
          surname: currentUser.surname,
          phone: currentUser.phone,
          company: currentUser.company,
          bio: currentUser.bio,
          website: currentUser.website || '',
          linkedin: currentUser.linkedin || '',
          twitter: currentUser.twitter || '',
          facebook: currentUser.facebook || '',
          vesselTypes: managerProfile?.vessel_types || [],
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleVesselTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vesselTypes: prev.vesselTypes.includes(type)
        ? prev.vesselTypes.filter(t => t !== type)
        : [...prev.vesselTypes, type]
    }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      // For iPhone users, refresh auth session before upload
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        // Refresh the session for mobile users
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          throw new Error('Please refresh the page and try again')
        }
      }

      const photoUrl = await uploadProfilePhoto(user.id, file)
      await updateUserProfile(user.id, { photo_url: photoUrl })
      setUser(prev => prev ? { ...prev, photo_url: photoUrl } : null)
      toast.success('Photo updated successfully')
    } catch (error: any) {
      console.error('Photo upload error:', error)
      if (error.message.includes('row-level security policy')) {
        toast.error('Authentication error. Please refresh the page and try again.')
      } else {
        toast.error(error.message || 'Failed to upload photo')
      }
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
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        facebook: formData.facebook,
      })

      await updateManagerProfile(user.id, formData.vesselTypes)

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

  if (isLoading) {
    return (
      <DashboardLayout requiredRole="manager">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout requiredRole="manager">
        <div className="text-center">
          <p className="text-gray-400">Failed to load profile</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requiredRole="manager">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-400">
            Manage your vessel manager profile and company information
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-white">{user.email}</span>
                    <EmailVerification userEmail={user.email} />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about your company and vessel management experience..."
                  className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  rows={4}
                  required
                />
              </div>

              {/* Social Media & Website */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Social Media & Website
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Website
                    </label>
                    <Input
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="Enter your website URL"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      LinkedIn
                    </label>
                    <Input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      placeholder="Enter your LinkedIn profile"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Twitter (X)
                    </label>
                    <Input
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      placeholder="Enter your Twitter handle"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Facebook
                    </label>
                    <Input
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      placeholder="Enter your Facebook profile"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vessel Types */}
          <Card>
            <CardHeader>
              <CardTitle>Vessel Types You Manage</CardTitle>
              <CardDescription>
                Select the types of vessels your company manages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {VESSEL_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-3 p-3 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.vesselTypes.includes(type)}
                      onChange={() => handleVesselTypeChange(type)}
                      className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">{type}</span>
                  </label>
                ))}
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
