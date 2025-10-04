-- Add new columns to appointments table
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS duration_estimate text,
ADD COLUMN IF NOT EXISTS skin_type text,
ADD COLUMN IF NOT EXISTS allergies_concerns text,
ADD COLUMN IF NOT EXISTS makeup_look_preference text,
ADD COLUMN IF NOT EXISTS reference_images text[],
ADD COLUMN IF NOT EXISTS event_type text,
ADD COLUMN IF NOT EXISTS number_of_people integer DEFAULT 1;

-- Add new columns to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'to-do',
ADD COLUMN IF NOT EXISTS assigned_to text,
ADD COLUMN IF NOT EXISTS due_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS estimated_duration text,
ADD COLUMN IF NOT EXISTS task_type text,
ADD COLUMN IF NOT EXISTS category_tags text[];

-- Update existing completed boolean to work with new status field
-- Keep completed for backward compatibility but status is the primary field now