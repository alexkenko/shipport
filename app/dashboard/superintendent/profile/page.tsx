'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { updateUserProfile, updateSuperintendentProfile, uploadProfilePhoto, getCurrentUser, getSuperintendentProfile } from '@/lib/auth'
import { VESSEL_TYPES, SUPERINTENDENT_SERVICES, CERTIFICATION_TYPES, SERVICE_TYPES } from '@/types'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { AuthUser } from '@/lib/auth'
import { CameraIcon, UserCircleIcon, MapPinIcon, CheckBadgeIcon, StarIcon } from '@heroicons/react/24/outline'
import { EmailVerification } from '@/components/ui/EmailVerification'
import { PremiumBadge } from '@/components/ui/PremiumBadge'
import { PortSearch } from '@/components/ui/PortSearch'


export default function SuperintendentProfilePage() {
  const searchParams = useSearchParams()
  const viewUserId = searchParams.get('id') // For external viewing
  const [user, setUser] = useState<AuthUser | null>(null)
  const [viewingUser, setViewingUser] = useState<any>(null) // For external viewing
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isExternalView, setIsExternalView] = useState(false)
  const [customCertification, setCustomCertification] = useState('')
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
    certifications: [] as string[],
    portsCovered: [] as string[],
    services: [] as string[],
    pricePerWorkday: '',
    pricePerIdleDay: '',
    serviceType: 'gangway_to_gangway' as 'door_to_door' | 'gangway_to_gangway',
  })

  useEffect(() => {
    if (viewUserId) {
      setIsExternalView(true)
      loadExternalProfile(viewUserId)
    } else {
      loadUserProfile()
    }
  }, [viewUserId])

  const loadExternalProfile = async (userId: string) => {
    try {
      // Load superintendent profile data for external viewing
      const { data: profileData, error } = await supabase
        .from('superintendent_profiles')
        .select(`
          *,
          users (
            id,
            name,
            surname,
            email,
            phone,
            company,
            bio,
            photo_url,
            website,
            linkedin,
            twitter,
            facebook,
            role
          )
        `)
        .eq('user_id', userId)
        .single()

      if (error) throw error

      if (profileData && profileData.users) {
        setViewingUser(profileData)
        setFormData({
          name: profileData.users.name,
          surname: profileData.users.surname,
          phone: profileData.users.phone,
          company: profileData.users.company,
          bio: profileData.users.bio,
          website: profileData.users.website || '',
          linkedin: profileData.users.linkedin || '',
          twitter: profileData.users.twitter || '',
          facebook: profileData.users.facebook || '',
          vesselTypes: profileData.vessel_types || [],
          certifications: profileData.certifications || [],
          portsCovered: profileData.ports_covered || [],
          services: profileData.services || [],
          pricePerWorkday: profileData.price_per_workday?.toString() || '',
          pricePerIdleDay: profileData.price_per_idle_day?.toString() || '',
          serviceType: profileData.service_type || 'gangway_to_gangway',
        })
      }
    } catch (error) {
      console.error('Error loading external profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        
        // Load extended superintendent profile data
        const superintendentProfile = await getSuperintendentProfile(currentUser.id)
        
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
          vesselTypes: superintendentProfile?.vessel_types || [],
          certifications: superintendentProfile?.certifications || [],
          portsCovered: superintendentProfile?.ports_covered || [],
          services: superintendentProfile?.services || [],
          pricePerWorkday: superintendentProfile?.price_per_workday?.toString() || '',
          pricePerIdleDay: superintendentProfile?.price_per_idle_day?.toString() || '',
          serviceType: superintendentProfile?.service_type || 'gangway_to_gangway',
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

  const handleMultiSelectChange = (type: 'vesselTypes' | 'certifications' | 'services', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }))
  }


  const handleAddCustomCertification = () => {
    if (customCertification.trim() && !formData.certifications.includes(customCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, customCertification.trim()]
      }))
      setCustomCertification('')
    }
  }


  const handleRemoveCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
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
        website: formData.website,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        facebook: formData.facebook,
      })

      await updateSuperintendentProfile(user.id, {
        vesselTypes: formData.vesselTypes,
        certifications: formData.certifications,
        portsCovered: formData.portsCovered,
        services: formData.services,
        pricePerWorkday: formData.pricePerWorkday ? parseFloat(formData.pricePerWorkday) : null,
        pricePerIdleDay: formData.pricePerIdleDay ? parseFloat(formData.pricePerIdleDay) : null,
        serviceType: formData.serviceType,
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
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-medium text-white">
                      {user.name} {user.surname}
                    </h3>
                    <PremiumBadge 
                      signupDate={user.created_at} 
                      role={user.role}
                      size="sm"
                    />
                  </div>
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
                      className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
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
              <div className="space-y-6">
                {/* Predefined Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Common Certifications
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {CERTIFICATION_TYPES.map((cert) => (
                      <label key={cert} className="flex items-center space-x-3 p-3 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.certifications.includes(cert)}
                          onChange={() => handleMultiSelectChange('certifications', cert)}
                          className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-300">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Certification Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Add Custom Certification
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCertification}
                      onChange={(e) => setCustomCertification(e.target.value)}
                      placeholder="e.g., BCAV, MLC, ISO 9001, etc."
                      className="flex-1 px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCertification())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomCertification}
                      disabled={!customCertification.trim()}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Selected Certifications Display */}
                {formData.certifications.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Your Certifications
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm"
                        >
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(cert)}
                            className="ml-1 hover:text-red-300 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                      className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-300">{service}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your daily rates for work and idle days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Per Workday (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="pricePerWorkday"
                      value={formData.pricePerWorkday}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Rate for active work days (inspections, audits, etc.)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price Per Idle Day (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="pricePerIdleDay"
                      value={formData.pricePerIdleDay}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Rate for standby/waiting days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Type */}
          <Card>
            <CardHeader>
              <CardTitle>Service Type</CardTitle>
              <CardDescription>
                Choose how you provide your services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SERVICE_TYPES.map((type) => (
                  <label key={type} className="flex items-center space-x-3 p-4 rounded-lg border border-dark-600 hover:border-primary-400 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="serviceType"
                      value={type.toLowerCase().replace(/\s+/g, '_')}
                      checked={formData.serviceType === type.toLowerCase().replace(/\s+/g, '_')}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceType: e.target.value as 'door_to_door' | 'gangway_to_gangway' }))}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-300">{type}</span>
                      <p className="text-xs text-gray-400 mt-1">
                        {type === 'Door to Door' 
                          ? 'Service includes travel from your location to the vessel and back'
                          : 'Service starts at the vessel gangway and ends there'
                        }
                      </p>
                    </div>
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
              <div className="space-y-6">
                <PortSearch
                  selectedPorts={formData.portsCovered}
                  onPortsChange={(ports) => setFormData(prev => ({ ...prev, portsCovered: ports }))}
                  placeholder="Enter ports where you can provide services..."
                />
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
