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
  homebase?: string
  website?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  created_at: string
  email_verified?: boolean
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
  console.log('🔐 Attempting to sign in with email:', email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('🔐 Supabase auth response:', { data: !!data, error: !!error })

    if (error) {
      console.error('🔐 Auth error:', error)
      throw error
    }

    if (data.user) {
      console.log('🔐 User authenticated, fetching user data...')
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError) {
        console.error('🔐 User data error:', userError)
        throw userError
      }
      
      console.log('🔐 User data fetched successfully:', userData?.email)
      return userData
    }

    console.log('🔐 No user data returned')
    return null
  } catch (error) {
    console.error('🔐 Sign in error:', error)
    throw error
  }
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
  
  return {
    id: userData.id,
    email: userData.email,
    role: userData.role as UserRole,
    name: userData.name,
    surname: userData.surname || '',
    phone: userData.phone || '',
    company: userData.company,
    bio: userData.bio || '',
    photo_url: userData.photo_url,
    website: userData.website,
    linkedin: userData.linkedin,
    twitter: userData.twitter,
    facebook: userData.facebook,
    created_at: userData.created_at,
    email_verified: user.email_confirmed_at !== null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  console.log('🔍 updateUserProfile called with:', { userId, updates })
  
  // Check authentication first
  const { data: { user: authUser } } = await supabase.auth.getUser()
  console.log('🔍 Current auth user:', authUser?.id)
  
  if (!authUser) {
    throw new Error('No authenticated user found')
  }
  
  if (authUser.id !== userId) {
    throw new Error(`User ID mismatch: auth user ${authUser.id} trying to update ${userId}`)
  }
  
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()

  console.log('🔍 Update result:', { data, error })
  console.log('🔍 Error details:', error)
  
  // If user doesn't exist, create them
  if (error && (error.code === 'PGRST116' || error.message?.includes('No rows found'))) {
    console.log('🔍 User not found, creating new user record')
    
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) throw new Error('No authenticated user found')
    
    const userData = {
      id: authData.user.id,
      email: authData.user.email!,
      role: 'superintendent', // Default role
      name: updates.name || '',
      surname: updates.surname || '',
      phone: updates.phone || '',
      company: updates.company || '',
      bio: updates.bio || '',
      homebase: updates.homebase || '',
      photo_url: updates.photo_url,
      website: updates.website,
      linkedin: updates.linkedin,
      twitter: updates.twitter,
      facebook: updates.facebook,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    
    console.log('🔍 Creating user with data:', userData)
    
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    console.log('🔍 Create result:', { newUser, createError })
    
    if (createError) {
      console.error('🔍 Create error details:', createError)
      throw createError
    }
    
    return newUser
  }
  
  if (error) {
    console.error('🔍 Update error details:', error)
    throw error
  }
  
  return data && data.length > 0 ? data[0] : null
}

export async function updateManagerProfile(userId: string, vesselTypes: string[]) {
  console.log('🔍 updateManagerProfile called with:', { userId, vesselTypes })
  
  // Check authentication first
  const { data: { user: authUser } } = await supabase.auth.getUser()
  console.log('🔍 Current auth user for manager profile:', authUser?.id)
  
  if (!authUser) {
    throw new Error('No authenticated user found for manager profile update')
  }
  
  if (authUser.id !== userId) {
    throw new Error(`User ID mismatch: auth user ${authUser.id} trying to update manager profile ${userId}`)
  }
  
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

  console.log('🔍 Manager profile update result:', { data, error })
  
  if (error) {
    console.error('🔍 Manager profile update error details:', error)
    throw error
  }
  
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
      upsert: true // Allow overwriting existing files
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath)

  return data.publicUrl
}
