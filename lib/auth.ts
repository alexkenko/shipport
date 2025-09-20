import { supabase } from './supabase'
import { User, UserRole } from '@/types'

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
}

export async function signUp(email: string, password: string, userData: {
  role: UserRole
  name: string
  surname: string
  phone: string
  company: string
  bio: string
}) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError

  if (authData.user) {
    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        role: userData.role,
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone,
        company: userData.company,
        bio: userData.bio,
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
    .single()

  if (error) throw error
  return data
}

export async function updateManagerProfile(userId: string, vesselTypes: string[]) {
  const { data, error } = await supabase
    .from('manager_profiles')
    .update({
      vessel_types: vesselTypes,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSuperintendentProfile(
  userId: string, 
  updates: {
    vesselTypes: string[]
    certifications: string[]
    portsCovered: string[]
    services: string[]
  }
) {
  const { data, error } = await supabase
    .from('superintendent_profiles')
    .update({
      vessel_types: updates.vesselTypes,
      certifications: updates.certifications,
      ports_covered: updates.portsCovered,
      services: updates.services,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadProfilePhoto(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `profile-photos/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath)

  return data.publicUrl
}
