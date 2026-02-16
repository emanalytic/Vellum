ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS predicted_satisfaction INTEGER DEFAULT NULL;

ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS actual_satisfaction INTEGER DEFAULT NULL;
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_predicted_satisfaction') THEN
        ALTER TABLE tasks 
        ADD CONSTRAINT check_predicted_satisfaction 
        CHECK (predicted_satisfaction >= 0 AND predicted_satisfaction <= 100);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_actual_satisfaction') THEN
        ALTER TABLE tasks 
        ADD CONSTRAINT check_actual_satisfaction 
        CHECK (actual_satisfaction >= 0 AND actual_satisfaction <= 100);
    END IF;
END $$;
