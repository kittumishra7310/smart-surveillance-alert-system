import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']
type User = Tables['users']['Row']
type Camera = Tables['cameras']['Row']
type Detection = Tables['detections']['Row']
type Alert = Tables['alerts']['Row']

export class DatabaseService {
  // User operations
  static async createUser(userData: Tables['users']['Insert']) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Database service createUser error:', error)
      throw error
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error getting user by email:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Database service getUserByEmail error:', error)
      throw error
    }
  }

  static async updateUserLastLogin(userId: string) {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)
    
    if (error) throw error
  }

  static async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Camera operations
  static async getAllCameras() {
    const { data, error } = await supabase
      .from('cameras')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async createCamera(cameraData: Tables['cameras']['Insert']) {
    const { data, error } = await supabase
      .from('cameras')
      .insert(cameraData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Detection operations
  static async createDetection(detectionData: Tables['detections']['Insert']) {
    const { data, error } = await supabase
      .from('detections')
      .insert(detectionData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getDetections(limit = 100) {
    const { data, error } = await supabase
      .from('detections')
      .select(`
        *,
        cameras (name, location)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  }

  static async getDetectionsByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('detections')
      .select(`
        *,
        cameras (name, location)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  // Analytics operations
  static async getDetectionStats(days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('detections')
      .select('created_at, detection_type, severity')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async getHourlyStats() {
    const { data, error } = await supabase
      .rpc('get_hourly_detection_stats')
    
    if (error) {
      console.log('RPC function not available, using fallback')
      // Fallback to regular query if RPC doesn't exist
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('detections')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      
      if (fallbackError) throw fallbackError
      return fallbackData || []
    }
    
    return data || []
  }

  // Alert operations
  static async createAlert(alertData: Tables['alerts']['Insert']) {
    const { data, error } = await supabase
      .from('alerts')
      .insert(alertData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getActiveAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        detections (
          detection_type,
          description,
          cameras (name, location)
        )
      `)
      .eq('acknowledged', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

export type { User, Camera, Detection, Alert }
