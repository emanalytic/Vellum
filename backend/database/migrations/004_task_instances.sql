ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS target_sessions_per_day INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS min_spacing_minutes INTEGER DEFAULT 60;


CREATE TABLE IF NOT EXISTS task_instances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'skipped')),
    actual_duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_instances_user_time 
ON task_instances(user_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS idx_task_instances_parent_id 
ON task_instances(task_id);
