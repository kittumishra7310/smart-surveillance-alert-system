
import { supabase } from '@/lib/supabase'

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Check if we can connect to Supabase and if tables exist
    const { data: testConnection, error: connectionError } = await supabase
      .from('cameras')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.log('Database tables may not exist or RLS policies prevent access.')
      console.error('Connection error:', connectionError)
      
      // Check if it's an RLS error
      if (connectionError.code === '42501') {
        console.log('Row Level Security is blocking access. Please configure RLS policies in Supabase dashboard.')
      }
      
      return false
    }

    // Insert sample cameras if none exist and we have access
    const { data: existingCameras, error: cameraError } = await supabase
      .from('cameras')
      .select('id')
      .limit(1)

    if (!cameraError && existingCameras && existingCameras.length === 0) {
      console.log('No cameras found, attempting to insert sample data...')
      
      const { error: insertError } = await supabase
        .from('cameras')
        .insert([
          { name: 'Main Entrance', location: 'Building A - Front Door', status: 'active' },
          { name: 'Parking Lot', location: 'Outdoor Parking Area', status: 'active' },
          { name: 'Warehouse', location: 'Storage Area B', status: 'active' },
          { name: 'Office Area', location: 'Floor 2 - Open Office', status: 'active' },
          { name: 'Loading Dock', location: 'Rear Building Entrance', status: 'maintenance' }
        ])

      if (insertError) {
        if (insertError.code === '42501') {
          console.log('RLS policy prevents inserting sample cameras. This is normal if RLS is enabled.')
        } else {
          console.error('Error inserting sample cameras:', insertError)
        }
      } else {
        console.log('Sample cameras inserted successfully')
      }
    }

    console.log('Database initialization completed')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}
