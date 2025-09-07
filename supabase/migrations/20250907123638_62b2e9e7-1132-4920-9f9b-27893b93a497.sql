-- Fix security vulnerabilities - Phase 1 Critical Fixes

-- 1. Clean up existing profiles policies
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure granular RLS policies for profiles
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

-- 2. Secure the public_profiles view
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

-- Enable security invoker to respect RLS
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- 3. Fix appointment policies for better security
DROP POLICY IF EXISTS "Service providers can view their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service providers can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service providers can delete their appointments" ON public.appointments;

-- Recreate secure appointment policies
CREATE POLICY "Service providers can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true); -- Allow booking but user_id will be validated by business logic

CREATE POLICY "Service providers can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Service providers can delete their appointments" 
ON public.appointments 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create secure function to get safe profile data
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