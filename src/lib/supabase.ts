
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://isnlnbinfzxeneyhgbdi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmxuYmluZnp4ZW5leWhnaGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0ODM1NTYsImV4cCI6MjA1MzA1OTU1Nn0.YXiYQQqnVJMOqhZbMj1q3QKZcOhYgDjPJ3YzXY5VFDY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          role: 'admin' | 'viewer'
          created_at: string
          last_login: string | null
          status: 'active' | 'inactive'
        }
        Insert: {
          username: string
          email: string
          role?: 'admin' | 'viewer'
          status?: 'active' | 'inactive'
        }
        Update: {
          username?: string
          email?: string
          role?: 'admin' | 'viewer'
          last_login?: string | null
          status?: 'active' | 'inactive'
        }
      }
      cameras: {
        Row: {
          id: string
          name: string
          location: string
          status: 'active' | 'inactive' | 'maintenance'
          stream_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          location: string
          status?: 'active' | 'inactive' | 'maintenance'
          stream_url?: string | null
        }
        Update: {
          name?: string
          location?: string
          status?: 'active' | 'inactive' | 'maintenance'
          stream_url?: string | null
          updated_at?: string
        }
      }
      detections: {
        Row: {
          id: string
          camera_id: string
          detection_type: string
          description: string
          confidence: number
          severity: 'low' | 'medium' | 'high'
          status: 'active' | 'resolved' | 'investigating'
          coordinates: any | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          camera_id: string
          detection_type: string
          description: string
          confidence: number
          severity?: 'low' | 'medium' | 'high'
          status?: 'active' | 'resolved' | 'investigating'
          coordinates?: any | null
          image_url?: string | null
        }
        Update: {
          status?: 'active' | 'resolved' | 'investigating'
          coordinates?: any | null
          image_url?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          detection_id: string
          alert_type: string
          message: string
          acknowledged: boolean
          acknowledged_by: string | null
          acknowledged_at: string | null
          created_at: string
        }
        Insert: {
          detection_id: string
          alert_type: string
          message: string
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
        }
        Update: {
          acknowledged?: boolean
          acknowledged_by?: string | null
          acknowledged_at?: string | null
        }
      }
    }
  }
}
