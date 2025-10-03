-- Remove the overly permissive "all" policy that allows everyone to see all appointments
DROP POLICY IF EXISTS "all" ON public.appointments;

-- Ensure users can only view their own appointments (policy already exists but making sure it's the only SELECT policy)
-- The existing policy "Service providers can view their own appointments only" already restricts this correctly