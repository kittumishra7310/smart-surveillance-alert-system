
import { supabase } from '@/lib/supabase'

export async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Note: Tables should be created through Supabase dashboard or migrations
    // This function will just insert sample data and check connections
    
    // Check if we can connect to Supabase
    const { data: testConnection, error: connectionError } = await supabase
      .from('cameras')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.log('Database tables may not exist yet. Please create them in Supabase dashboard.')
      console.error('Connection error:', connectionError)
      return false
    }

    // Insert sample cameras if none exist
    const { data: existingCameras, error: cameraError } = await supabase
      .from('cameras')
      .select('id')
      .limit(1)

    if (!cameraError && existingCameras && existingCameras.length === 0) {
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
        console.error('Error inserting sample cameras:', insertError)
      } else {
        console.log('Sample cameras inserted successfully')
      }
    }

    // Insert sample detections if none exist
    const { data: existingDetections } = await supabase
      .from('detections')
      .select('id')
      .limit(1)

    if (existingDetections && existingDetections.length === 0) {
      // Get camera IDs first
      const { data: cameras } = await supabase
        .from('cameras')
        .select('id')
        .limit(3)

      if (cameras && cameras.length > 0) {
        const sampleDetections = [
          {
            camera_id: cameras[0].id,
            detection_type: 'Person Detection',
            description: 'Unauthorized person detected in restricted area',
            confidence: 0.95,
            severity: 'high',
            status: 'active'
          },
          {
            camera_id: cameras[1].id,
            detection_type: 'Motion Detection',
            description: 'Unusual movement detected after hours',
            confidence: 0.87,
            severity: 'medium',
            status: 'investigating'
          },
          {
            camera_id: cameras[2].id,
            detection_type: 'Object Detection',
            description: 'Unattended bag detected',
            confidence: 0.92,
            severity: 'high',
            status: 'resolved'
          }
        ]

        const { error: detectionsError } = await supabase
          .from('detections')
          .insert(sampleDetections)

        if (detectionsError) {
          console.error('Error inserting sample detections:', detectionsError)
        } else {
          console.log('Sample detections inserted successfully')
        }
      }
    }

    console.log('Database initialization completed successfully')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}
