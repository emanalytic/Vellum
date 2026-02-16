
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true;
