
import { supabase } from '@/lib/supabase'

export async function initializeDatabase() {
  try {
    // Create users table
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE
      );
    `

    // Create cameras table
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS cameras (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
        stream_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create detections table
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS detections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        camera_id UUID REFERENCES cameras(id) ON DELETE CASCADE,
        detection_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
        severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating')),
        coordinates JSONB,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Create alerts table
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        detection_id UUID REFERENCES detections(id) ON DELETE CASCADE,
        alert_type VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        acknowledged BOOLEAN DEFAULT FALSE,
        acknowledged_by UUID REFERENCES users(id),
        acknowledged_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Insert default cameras
    await supabase.sql`
      INSERT INTO cameras (name, location, status) VALUES
      ('Main Entrance', 'Building A - Front Door', 'active'),
      ('Parking Lot', 'Outdoor Parking Area', 'active'),
      ('Warehouse', 'Storage Area B', 'active'),
      ('Office Area', 'Floor 2 - Open Office', 'active'),
      ('Loading Dock', 'Rear Building Entrance', 'maintenance')
      ON CONFLICT DO NOTHING;
    `

    // Create RPC function for hourly stats (if possible)
    await supabase.sql`
      CREATE OR REPLACE FUNCTION get_hourly_detection_stats()
      RETURNS TABLE(hour INTEGER, detection_count BIGINT) 
      LANGUAGE SQL
      AS $$
        SELECT 
          EXTRACT(hour FROM created_at)::INTEGER as hour,
          COUNT(*) as detection_count
        FROM detections 
        WHERE created_at >= NOW() - INTERVAL '24 hours'
        GROUP BY EXTRACT(hour FROM created_at)
        ORDER BY hour;
      $$;
    `

    console.log('Database initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing database:', error)
    return false
  }
}
