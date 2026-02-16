-- Daily AI Usage Limit Table
CREATE TABLE IF NOT EXISTS ai_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster daily lookups
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_today ON ai_usage (user_id, created_at);
