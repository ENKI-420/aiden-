-- Add MFA and digital twin access fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS has_mfa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS digital_twin_access TEXT[] DEFAULT '{}';

-- Create digital_twins table
CREATE TABLE IF NOT EXISTS digital_twins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  patient_id TEXT NOT NULL,
  model_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create digital_twin_access table for access control
CREATE TABLE IF NOT EXISTS digital_twin_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  digital_twin_id TEXT REFERENCES digital_twins(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  access_level TEXT NOT NULL DEFAULT 'view-only',
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  UNIQUE(digital_twin_id, user_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE digital_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_twin_access ENABLE ROW LEVEL SECURITY;

-- Create policies for digital_twins
CREATE POLICY "Users can view digital twins they have access to"
  ON digital_twins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM digital_twin_access
      WHERE digital_twin_access.digital_twin_id = digital_twins.id
      AND digital_twin_access.user_id = auth.uid()
    )
  );

-- Create policies for digital_twin_access
CREATE POLICY "Users can view their own access"
  ON digital_twin_access FOR SELECT
  USING (user_id = auth.uid());

-- Create policy for admins
CREATE POLICY "Admins can view all digital twins"
  ON digital_twins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all access records"
  ON digital_twin_access FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Create function to update last_accessed timestamp
CREATE OR REPLACE FUNCTION update_digital_twin_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE digital_twins
  SET last_accessed = NOW()
  WHERE id = NEW.digital_twin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_accessed timestamp
CREATE TRIGGER update_digital_twin_last_accessed
AFTER INSERT OR UPDATE ON digital_twin_access
FOR EACH ROW
EXECUTE FUNCTION update_digital_twin_last_accessed();

-- Create function to update digital_twin_access array in profiles
CREATE OR REPLACE FUNCTION update_profile_digital_twin_access()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET digital_twin_access = (
    SELECT array_agg(digital_twin_id)
    FROM digital_twin_access
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update digital_twin_access array in profiles
CREATE TRIGGER update_profile_digital_twin_access
AFTER INSERT OR UPDATE OR DELETE ON digital_twin_access
FOR EACH ROW
EXECUTE FUNCTION update_profile_digital_twin_access();
