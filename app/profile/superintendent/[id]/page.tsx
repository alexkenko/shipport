'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { CheckBadgeIcon, StarIcon, MapPinIcon, UserCircleIcon } from '@heroicons/react/24/outline'

interface Port {
  id: string
  name: string
  country: string
  city: string
}

export default function PublicSuperintendentProfile() {
  const params = useParams()
  const userId = params.id as string
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
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
        setProfileData(profileData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The requested profile could not be found.</p>
        </div>
      </div>
    )
  }

  const { users: user, ...profile } = profileData

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-dark-800 border-dark-700">
            <CardHeader>
              <div className="flex items-start space-x-6">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={`${user.name} ${user.surname}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-24 w-24 text-gray-400" />
                )}
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2">
                    {user.name} {user.surname}
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-300 mb-2">
                    {user.company}
                  </CardDescription>
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>📧 {user.email}</div>
                    <div>📞 {user.phone}</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bio */}
              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Pricing */}
              {(profile.price_per_workday || profile.price_per_idle_day) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <StarIcon className="h-5 w-5 mr-2" />
                    Pricing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.price_per_workday && (
                      <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">${profile.price_per_workday}</div>
                        <div className="text-sm opacity-90">Per Work Day</div>
                      </div>
                    )}
                    {profile.price_per_idle_day && (
                      <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold">${profile.price_per_idle_day}</div>
                        <div className="text-sm opacity-90">Per Idle Day</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vessel Types */}
              {profile.vessel_types?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Vessel Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.vessel_types.map((vessel: string, index: number) => (
                      <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                        {vessel}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {profile.certifications?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <CheckBadgeIcon className="h-5 w-5 mr-2" />
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert: string, index: number) => (
                      <span key={index} className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {profile.services?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service: string, index: number) => (
                      <span key={index} className="bg-marine-600 text-white px-3 py-1 rounded-full text-sm">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Areas */}
              {profile.ports_covered?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Service Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.ports_covered.map((port: string, index: number) => (
                      <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {port}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(user.website || user.linkedin || user.twitter || user.facebook) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Links</h3>
                  <div className="flex flex-wrap gap-4">
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        Website
                      </a>
                    )}
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        LinkedIn
                      </a>
                    )}
                    {user.twitter && (
                      <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        Twitter
                      </a>
                    )}
                    {user.facebook && (
                      <a href={user.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
