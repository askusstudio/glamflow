-- Critical Security Fix: Protect Customer Contact Information and Public Profiles

-- 1. Fix public_profiles view access - add proper RLS policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.public_profiles;

-- Grant explicit access to the view for anonymous and authenticated users for the safe data only
-- The view already filters out sensitive data like email and phone
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- 2. Fix the critical appointments security issue
-- Remove the overly permissive policy that allows anyone to create appointments
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;

-- Create a more secure policy that still allows booking but prevents data harvesting
CREATE POLICY "Authenticated users can create appointments for valid service providers" 
ON public.appointments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = user_id 
    AND p.id != auth.uid() -- Prevent self-booking which could be used for testing/harvesting
  )
);

-- 3. Add a policy to prevent unauthorized access to appointment data
-- Only the service provider should see their appointment details
DROP POLICY IF EXISTS "Service providers can view their appointments" ON public.appointments;

CREATE POLICY "Service providers can view their own appointments only" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Create a secure function for public profile access that never exposes contact info
CREATE OR REPLACE FUNCTION public.get_public_profile_safe(profile_id uuid)
RETURNS TABLE(
  id uuid, 
  full_name text, 
  bio text, 
  city text, 
  category text, 
  services text, 
  price_range text, 
  portfolio_images text[], 
  available_days text[], 
  avatar_url text, 
  social_accounts text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.bio,
    p.city,
    p.category,
    p.services,
    p.price_range,
    p.portfolio_images,
    p.available_days,
    p.avatar_url,
    p.social_accounts
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;

-- 5. Add function to validate legitimate appointment creation
CREATE OR REPLACE FUNCTION public.can_book_appointment(provider_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = provider_id 
    AND p.id != COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)
  );
$$;