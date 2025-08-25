-- Update appointments table to match the expected schema
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS client_email TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS client_phone TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS appointment_date DATE,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS message TEXT;

-- Remove default values for required fields
ALTER TABLE appointments ALTER COLUMN client_email DROP DEFAULT;
ALTER TABLE appointments ALTER COLUMN client_phone DROP DEFAULT;