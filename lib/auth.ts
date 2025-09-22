import { supabase } from './supabase'
import { User, UserRole } from '@/types'
import { InputValidator, RateLimiter } from './validation'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  name: string
  surname: string
  phone: string
  company: string
  bio: string
  photo_url?: string
  website?: string
  linkedin?: string
  twitter?: string
  facebook?: string
}

export async function signUp(email: string, password: string, userData: {
  role: UserRole
  name: string
  surname: string
  phone: string
  company: string
  bio: string
}) {
  // Rate limiting
  const clientIP = typeof window !== 'undefined' ? 'browser' : 'server'
  const rateLimitKey = `signup:${clientIP}`
  
  if (!RateLimiter.checkLimit(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
    throw new Error('Too many signup attempts. Please try again later.')
  }

  // Input validation
  const emailValidation = InputValidator.validateEmail(email)
  if (!emailValidation.isValid) {
    throw new Error(`Email validation failed: ${emailValidation.errors.join(', ')}`)
  }

  const nameValidation = InputValidator.validateName(userData.name, 'First name')
  if (!nameValidation.isValid) {
    throw new Error(`Name validation failed: ${nameValidation.errors.join(', ')}`)
  }

  const surnameValidation = InputValidator.validateName(userData.surname, 'Last name')
  if (!surnameValidation.isValid) {
    throw new Error(`Surname validation failed: ${surnameValidation.errors.join(', ')}`)
  }

  const phoneValidation = InputValidator.validatePhone(userData.phone)
  if (!phoneValidation.isValid) {
    throw new Error(`Phone validation failed: ${phoneValidation.errors.join(', ')}`)
  }

  const companyValidation = InputValidator.validateCompany(userData.company)
  if (!companyValidation.isValid) {
    throw new Error(`Company validation failed: ${companyValidation.errors.join(', ')}`)
  }

  const bioValidation = InputValidator.validateBio(userData.bio)
  if (!bioValidation.isValid) {
    throw new Error(`Bio validation failed: ${bioValidation.errors.join(', ')}`)
  }

  // Password validation
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long')
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: emailValidation.sanitizedValue!,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: emailValidation.sanitizedValue!,
        role: userData.role,
        name: nameValidation.sanitizedValue!,
        surname: surnameValidation.sanitizedValue!,
        phone: phoneValidation.sanitizedValue!,
        company: companyValidation.sanitizedValue!,
        bio: bioValidation.sanitizedValue!,
      })
      .select()
      .single()

    if (userError) throw userError

    // Create role-specific profile
    if (userData.role === 'manager') {
      const { error: profileError } = await supabase
        .from('manager_profiles')
        .insert({
          user_id: authData.user.id,
          vessel_types: [],
        })

      if (profileError) throw profileError
    } else if (userData.role === 'superintendent') {
      const { error: profileError } = await supabase
        .from('superintendent_profiles')
        .insert({
          user_id: authData.user.id,
          vessel_types: [],
          certifications: [],
          ports_covered: [],
          services: [],
        })

      if (profileError) throw profileError
    }

    return insertedUser
  }

  return null
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (data.user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError) throw userError
    return userData
  }

  return null
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return userData
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export async function updateManagerProfile(userId: string, vesselTypes: string[]) {
  const { data, error } = await supabase
    .from('manager_profiles')
    .upsert({
      user_id: userId,
      vessel_types: vesselTypes,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })
    .select()

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export async function updateSuperintendentProfile(
  userId: string, 
  updates: {
    vesselTypes: string[]
    certifications: string[]
    portsCovered: string[]
    services: string[]
    pricePerWorkday?: number | null
    pricePerIdleDay?: number | null
    serviceType: 'door_to_door' | 'gangway_to_gangway'
  }
) {
  const { data, error } = await supabase
    .from('superintendent_profiles')
    .upsert({
      user_id: userId,
      vessel_types: updates.vesselTypes,
      certifications: updates.certifications,
      ports_covered: updates.portsCovered,
      services: updates.services,
      price_per_workday: updates.pricePerWorkday,
      price_per_idle_day: updates.pricePerIdleDay,
      service_type: updates.serviceType,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    })
    .select()

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export async function getManagerProfile(userId: string) {
  const { data, error } = await supabase
    .from('manager_profiles')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export async function getSuperintendentProfile(userId: string) {
  const { data, error } = await supabase
    .from('superintendent_profiles')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export async function uploadProfilePhoto(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `profile-photos/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      upsert: true // This allows overwriting existing files
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath)

  return data.publicUrl
}
