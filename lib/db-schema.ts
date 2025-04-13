// This is a reference for the Supabase database schema
// You would implement this in your Supabase dashboard or migration scripts

/*
Table: user_preferences
- user_id (primary key, references auth.users.id)
- preferred_mode (text, default: 'general')
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_mode TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update the chat_logs table to include mode information
ALTER TABLE chat_logs ADD COLUMN mode TEXT DEFAULT 'general';
*/
