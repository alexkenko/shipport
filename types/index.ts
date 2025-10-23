export type UserRole = 'manager' | 'superintendent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  surname: string;
  phone: string;
  company: string;
  bio: string;
  photo_url?: string;
  homebase?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  created_at: string;
  updated_at: string;
}

export interface ManagerProfile extends User {
  role: 'manager';
  vessel_types: string[];
}

export interface SuperintendentProfile extends User {
  role: 'superintendent';
  vessel_types: string[];
  certifications: string[];
  ports_covered: string[];
  services: string[];
  price_per_workday?: number;
  price_per_idle_day?: number;
  service_type: 'door_to_door' | 'gangway_to_gangway';
}

export interface Job {
  id: string;
  manager_id: string;
  title: string;
  description: string;
  port_name: string;
  attendance_type: string;
  vessel_type: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  // User data from join
  users?: {
    name: string;
    surname: string;
    company: string;
    email?: string;
    phone?: string;
    photo_url?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    email_verifications?: {
      is_verified: boolean;
    }[];
  };
  // Application status for current user (only used in superintendent search)
  application_status?: 'pending' | 'accepted' | 'rejected' | null;
}

export interface JobApplication {
  id: string;
  job_id: string;
  superintendent_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'job_application' | 'job_interest' | 'profile_view';
  title: string;
  message: string;
  is_read: boolean;
  related_id?: string; // job_id or application_id
  created_at: string;
}

export interface SearchFilters {
  port_name?: string;
  attendance_type?: string;
  vessel_type?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
}

// Port data structure for comprehensive port database
export interface Port {
  id: string;
  name: string;
  country: string;
  city: string;
  code: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Service types for superintendents
export const SUPERINTENDENT_SERVICES = [
  'Pre-Vetting Inspections',
  'Marine Consultancy',
  'TMSA Preparation',
  'ISM, ISPS, MLC Audits',
  'Bulk Vessel Inspections',
  'Pre Purchase Inspections',
  'Cargo Supervision',
  'Remote Navigation Audits',
  'Safety & Compliance Supervision',
  'Navigation Audits and Assessment',
  'Flag state inspections',
  'Accident and Incident investigation',
  'VDR analysis',
  'ISM SMS Development, Simplification & Gap Analysis'
] as const;

// Certification types
export const CERTIFICATION_TYPES = [
  'ISM',
  'ISPS',
  'MLC',
  'ISO 9001',
  'ISO 14001',
  'OHSAS 18001',
  'TMSA',
  'CDI',
  'RightShip',
  'Other'
] as const;

// Vessel types
export const VESSEL_TYPES = [
  'Bulk Carrier',
  'Container Ship',
  'Tanker',
  'General Cargo',
  'RoRo',
  'Passenger Ship',
  'Offshore Vessel',
  'Tug',
  'Barge',
  'Other'
] as const;

// Attendance types
export const ATTENDANCE_TYPES = [
  'Pre-Vetting Inspection',
  'Flag State Inspection',
  'Port State Control',
  'Cargo Operations',
  'Emergency Response',
  'Audit',
  'Consultation',
  'Training',
  'Other'
] as const;

// Service types for superintendents
export const SERVICE_TYPES = [
  'Door to Door',
  'Gangway to Gangway'
] as const;

// Blog system types
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  author_id: string | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  reading_time: number | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  author?: {
    id: string;
    name: string;
    surname: string;
    photo_url: string | null;
  };
  category?: BlogCategory;
  seo_data?: BlogSeoData;
}

export interface BlogSeoData {
  id: string;
  post_id: string;
  schema_type: string;
  json_ld_data: any;
  focus_keyword: string | null;
  created_at: string;
  updated_at: string;
}