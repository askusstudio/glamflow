-- Fix SECURITY DEFINER view issue by recreating public_profiles without it

-- Drop the view and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- Create a regular view (not SECURITY DEFINER) that respects RLS
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

-- Enable security_invoker to use the caller's permissions
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Grant SELECT access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;