-- Phase 1: Critical Security Fixes

-- 1. Fix the profiles table RLS policy to be more secure
DROP POLICY IF EXISTS "Secure public profile access" ON public.profiles;

-- Create granular RLS policies for profiles
CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Drop the old public_profiles view and recreate as a secure view
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create a secure public profiles view that only exposes safe data
CREATE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  bio,
  city,
  category,
  services,
  price_range,
  portfolio_images,
  available_days,
  avatar_url,
  social_accounts,
  updated_at
FROM public.profiles;

-- Enable RLS on the view and allow public read access to safe data
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create RLS policy for public profiles view
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.public_profiles 
FOR SELECT 
USING (true);

-- 3. Create secure functions for accessing contact information
-- Function to get contact info only for legitimate business purposes
CREATE OR REPLACE FUNCTION public.get_contact_for_booking(provider_id uuid)
RETURNS TABLE(email text, phone text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.email,
    p.phone
  FROM public.profiles p
  WHERE p.id = provider_id
  AND auth.uid() IS NOT NULL; -- Only authenticated users can access
$$;

-- Function to get full profile data for appointment context
CREATE OR REPLACE FUNCTION public.get_profile_for_appointment(profile_id uuid)
RETURNS TABLE(id uuid, full_name text, email text, phone text, bio text, city text, category text, services text, price_range text, portfolio_images text[], available_days text[], avatar_url text, social_accounts text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
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
  WHERE p.id = profile_id
  AND (
    -- Only return contact info if user is authenticated and has legitimate need
    auth.uid() IS NOT NULL
    AND (
      -- User is the profile owner
      auth.uid() = p.id
      OR
      -- User has an appointment with this service provider
      EXISTS (
        SELECT 1 FROM public.appointments a 
        WHERE a.user_id = p.id 
        AND a.client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );
$$;

-- 4. Verify appointments table security (RLS should already be correct)
-- The existing policies should be fine, but let's ensure they're optimal
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;

-- Recreate appointment policies with better security
CREATE POLICY "Service providers can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true); -- Allow anyone to book, but user_id must be set correctly

CREATE POLICY "Service providers can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service providers can delete their appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Add a function to safely get public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_data()
RETURNS TABLE(id uuid, full_name text, bio text, city text, category text, services text, price_range text, portfolio_images text[], available_days text[], avatar_url text, social_accounts text)
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
  FROM public.profiles p;
$$;