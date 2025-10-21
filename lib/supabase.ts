import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

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
          homebase?: string
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
          homebase?: string
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
          homebase?: string
          created_at?: string
          updated_at?: string
        }
      }
      ports: {
        Row: {
          id: string
          world_port_index?: string
          region_name?: string
          main_port_name: string
          alternate_port_name?: string
          un_locode?: string
          country_code?: string
          country_name?: string
          world_water_body?: string
          iho_sea_area?: string
          latitude?: number
          longitude?: number
          harbor_size?: string
          harbor_type?: string
          harbor_use?: string
          shelter_afforded?: string
          tidal_range?: number
          entrance_width?: number
          channel_depth?: number
          anchorage_depth?: number
          cargo_pier_depth?: number
          max_vessel_length?: number
          max_vessel_beam?: number
          max_vessel_draft?: number
          pilotage_compulsory: boolean
          pilotage_available: boolean
          tugs_assistance: boolean
          facilities_wharves: boolean
          facilities_anchorage: boolean
          facilities_container: boolean
          facilities_oil_terminal: boolean
          facilities_lng_terminal: boolean
          search_text?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          world_port_index?: string
          region_name?: string
          main_port_name: string
          alternate_port_name?: string
          un_locode?: string
          country_code?: string
          country_name?: string
          world_water_body?: string
          iho_sea_area?: string
          latitude?: number
          longitude?: number
          harbor_size?: string
          harbor_type?: string
          harbor_use?: string
          shelter_afforded?: string
          tidal_range?: number
          entrance_width?: number
          channel_depth?: number
          anchorage_depth?: number
          cargo_pier_depth?: number
          max_vessel_length?: number
          max_vessel_beam?: number
          max_vessel_draft?: number
          pilotage_compulsory?: boolean
          pilotage_available?: boolean
          tugs_assistance?: boolean
          facilities_wharves?: boolean
          facilities_anchorage?: boolean
          facilities_container?: boolean
          facilities_oil_terminal?: boolean
          facilities_lng_terminal?: boolean
          search_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          world_port_index?: string
          region_name?: string
          main_port_name?: string
          alternate_port_name?: string
          un_locode?: string
          country_code?: string
          country_name?: string
          world_water_body?: string
          iho_sea_area?: string
          latitude?: number
          longitude?: number
          harbor_size?: string
          harbor_type?: string
          harbor_use?: string
          shelter_afforded?: string
          tidal_range?: number
          entrance_width?: number
          channel_depth?: number
          anchorage_depth?: number
          cargo_pier_depth?: number
          max_vessel_length?: number
          max_vessel_beam?: number
          max_vessel_draft?: number
          pilotage_compulsory?: boolean
          pilotage_available?: boolean
          tugs_assistance?: boolean
          facilities_wharves?: boolean
          facilities_anchorage?: boolean
          facilities_container?: boolean
          facilities_oil_terminal?: boolean
          facilities_lng_terminal?: boolean
          search_text?: string
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
    }
  }
}