'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserRole, VESSEL_TYPES, SUPERINTENDENT_SERVICES, CERTIFICATION_TYPES } from '@/types'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { MapPinIcon } from '@heroicons/react/24/outline'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserRole | null>(null)
  
  const [customCertification, setCustomCertification] = useState('')
  const [customPort, setCustomPort] = useState('')
  const [searchPort, setSearchPort] = useState('')
  const [ports, setPorts] = useState<any[]>([])
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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
    const type = searchParams.get('type') as UserRole
    if (type && ['manager', 'superintendent'].includes(type)) {
      setUserType(type)
    }
    loadPorts()
  }, [searchParams])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      setIsLoading(true)

      try {
        const user = await signUp(formData.email, formData.password, {
          role: userType!,
          name: formData.name,
          surname: formData.surname,
          phone: formData.phone,
          company: formData.company,
          bio: formData.bio,
        })

        if (user) {
          toast.success('Account created successfully!')
          
          // Redirect based on user role
          if (user.role === 'manager') {
            router.push('/dashboard/manager')
          } else {
            router.push('/dashboard/superintendent')
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to create account')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleCheckboxChange = (type: 'vesselTypes' | 'certifications' | 'services', value: string) => {
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

  const handleAddCustomPort = () => {
    if (customPort.trim() && !formData.portsCovered.includes(customPort.trim())) {
      setFormData(prev => ({
        ...prev,
        portsCovered: [...prev.portsCovered, customPort.trim()]
      }))
      setCustomPort('')
    }
  }

  const handleRemoveCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }))
  }

  const handlePortAdd = (port: any) => {
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

  const filteredPorts = ports.filter(port =>
    port.name.toLowerCase().includes(searchPort.toLowerCase()) ||
    port.city.toLowerCase().includes(searchPort.toLowerCase()) ||
    port.country.toLowerCase().includes(searchPort.toLowerCase())
  ).slice(0, 10)

  const canProceed = () => {
    if (step === 1) {
      return userType && formData.email && formData.password && formData.confirmPassword
    }
    if (step === 2) {
      return formData.name && formData.surname && formData.phone && formData.company && formData.bio
    }
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-marine-950 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card variant="glass">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Join <span className="text-blue-700">Ship</span><span className="text-red-500">in</span><span className="text-cyan-400">Port</span><span className="text-gray-400">.com</span>
            </CardTitle>
            <CardDescription>
              {step === 1 ? 'Create your account' : 'Complete your profile'}
            </CardDescription>
          </CardHeader>
          
          {/* Back to Home Link */}
          <div className="px-6 pb-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-200 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        I am a:
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setUserType('manager')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            userType === 'manager'
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-dark-600 hover:border-primary-400'
                          }`}
                        >
                          <h3 className="font-semibold text-white mb-2">Vessel Manager</h3>
                          <p className="text-sm text-gray-400">
                            I need to find qualified marine superintendents for vessel inspections and services.
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType('superintendent')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            userType === 'superintendent'
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-dark-600 hover:border-primary-400'
                          }`}
                        >
                          <h3 className="font-semibold text-white mb-2">Marine Superintendent</h3>
                          <p className="text-sm text-gray-400">
                            I provide marine inspection and consulting services to vessel managers.
                          </p>
                        </button>
                      </div>
                    </div>

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      required
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      required
                    />

                    <Input
                      label="Last Name"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />

                    <Input
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your company..."
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      rows={4}
                      required
                    />
                  </div>

                  {userType === 'manager' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Types of Vessels You Manage
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {VESSEL_TYPES.map((type) => (
                          <label key={type} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.vesselTypes.includes(type)}
                              onChange={() => handleCheckboxChange('vesselTypes', type)}
                              className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-300">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {userType === 'superintendent' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Vessel Types You Work With
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {VESSEL_TYPES.map((type) => (
                            <label key={type} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.vesselTypes.includes(type)}
                                onChange={() => handleCheckboxChange('vesselTypes', type)}
                                className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-300">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Certifications
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {CERTIFICATION_TYPES.map((cert) => (
                            <label key={cert} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.certifications.includes(cert)}
                                onChange={() => handleCheckboxChange('certifications', cert)}
                                className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-300">{cert}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                          Services You Provide
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {SUPERINTENDENT_SERVICES.map((service) => (
                            <label key={service} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={() => handleCheckboxChange('services', service)}
                                className="rounded border-dark-600 bg-dark-800 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-300">{service}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="flex gap-4">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                
                <Button
                  type="submit"
                  className={step === 2 ? "flex-1" : "w-full"}
                  isLoading={isLoading}
                  disabled={!canProceed()}
                >
                  {step === 1 ? 'Continue' : 'Create Account'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
