-- Migration: Add sound_enabled to user_preferences
-- Description: Adds a boolean flag to track if the user wants tactile sounds.

ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS sound_enabled BOOLEAN DEFAULT true;
