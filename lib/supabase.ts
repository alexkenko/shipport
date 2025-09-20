import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xumhixssblldxhteyakk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bWhpeHNzYmxsZHhodGV5YWtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTg0MTUsImV4cCI6MjA3MzkzNDQxNX0.WcIb_9hvXW9VARkO-V8EgltsUUMfXQRGa2xtrAt5KU8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'manager' | 'superintendent'
          name: string
          surname: string
          phone: string
          company: string
          bio: string
          photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role: 'manager' | 'superintendent'
          name: string
          surname: string
          phone: string
          company: string
          bio: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'manager' | 'superintendent'
          name?: string
          surname?: string
          phone?: string
          company?: string
          bio?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      manager_profiles: {
        Row: {
          id: string
          user_id: string
          vessel_types: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vessel_types: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vessel_types?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      superintendent_profiles: {
        Row: {
          id: string
          user_id: string
          vessel_types: string[]
          certifications: string[]
          ports_covered: string[]
          services: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vessel_types: string[]
          certifications: string[]
          ports_covered: string[]
          services: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vessel_types?: string[]
          certifications?: string[]
          ports_covered?: string[]
          services?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          manager_id: string
          title: string
          description: string
          port_name: string
          attendance_type: string
          vessel_type: string
          start_date: string
          end_date: string
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manager_id: string
          title: string
          description: string
          port_name: string
          attendance_type: string
          vessel_type: string
          start_date: string
          end_date: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manager_id?: string
          title?: string
          description?: string
          port_name?: string
          attendance_type?: string
          vessel_type?: string
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          job_id: string
          superintendent_id: string
          status: 'pending' | 'accepted' | 'rejected'
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          superintendent_id: string
          status?: 'pending' | 'accepted' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          superintendent_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'job_application' | 'job_interest' | 'profile_view'
          title: string
          message: string
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'job_application' | 'job_interest' | 'profile_view'
          title: string
          message: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'job_application' | 'job_interest' | 'profile_view'
          title?: string
          message?: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
      ports: {
        Row: {
          id: string
          name: string
          country: string
          city: string
          code: string
          coordinates: any | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          country: string
          city: string
          code: string
          coordinates?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string
          city?: string
          code?: string
          coordinates?: any | null
          created_at?: string
        }
      }
    }
  }
}