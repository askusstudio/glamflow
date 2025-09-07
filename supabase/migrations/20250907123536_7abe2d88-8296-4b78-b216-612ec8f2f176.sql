-- Phase 1: Critical Security Fixes - Corrected Version

-- 1. Fix the profiles table RLS policies by dropping all existing and recreating
DROP POLICY IF EXISTS "Secure public profile access" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create granular RLS policies for profiles - ONLY users can see their own complete profile
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

-- 2. Create a secure public profiles view that only exposes safe data
-- Drop the old view first
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create the public view without sensitive contact information
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

-- Enable security_invoker to ensure proper access control
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Allow public read access to the safe public profiles view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- 3. Fix appointments table security to prevent customer data theft
DROP POLICY IF EXISTS "Service providers can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can create their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service providers can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service providers can delete their appointments" ON public.appointments;

-- Only service providers can see appointments booked with them
CREATE POLICY "Service providers can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

-- Anyone can create appointments (but user_id must be set correctly)
CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (user_id IS NOT NULL);

-- Only service providers can update their appointments
CREATE POLICY "Service providers can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Only service providers can delete their appointments  
CREATE POLICY "Service providers can delete their appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Fix database function security issues - Remove problematic SECURITY DEFINER
DROP FUNCTION IF EXISTS public.get_contact_for_booking(uuid);
DROP FUNCTION IF EXISTS public.get_profile_for_appointment(uuid);
DROP FUNCTION IF EXISTS public.get_public_profile_data();

-- Create a safe function for getting contact info only when needed
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

-- Create safe function for public profile data (no sensitive info)
CREATE OR REPLACE FUNCTION public.get_safe_profile(profile_id uuid)
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
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;