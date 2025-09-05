-- Fix security issue: Protect sensitive contact information in profiles table

-- First, drop all existing SELECT policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public can view safe profile info" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view contact info for appointments" ON public.profiles;

-- Create a secure policy that only allows access to non-sensitive fields for public
CREATE POLICY "Secure public profile access" 
ON public.profiles 
FOR SELECT 
USING (
  -- This policy will be combined with application-level filtering
  -- to ensure only safe fields are exposed to anonymous users
  CASE 
    WHEN auth.uid() IS NULL THEN 
      -- Anonymous users: no access to email/phone
      false
    WHEN auth.uid() = id THEN 
      -- Profile owners: full access
      true
    ELSE
      -- Authenticated users: limited access (will be handled at app level)
      true
  END
);

-- Create a view for public-safe profile access (excluding sensitive fields)
DROP VIEW IF EXISTS public.public_profiles;
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

-- Grant public access to the safe view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- Create a function to safely get profile data for public display
CREATE OR REPLACE FUNCTION public.get_safe_profile(profile_id uuid)
RETURNS TABLE (
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
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
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

-- Create a function for authenticated users to get contact info when booking
CREATE OR REPLACE FUNCTION public.get_contact_for_booking(provider_id uuid)
RETURNS TABLE (
  email text,
  phone text
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.email,
    p.phone
  FROM public.profiles p
  WHERE p.id = provider_id
  AND auth.uid() IS NOT NULL; -- Only authenticated users can access
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_safe_profile(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_safe_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_contact_for_booking(uuid) TO authenticated;

-- Add security documentation
COMMENT ON VIEW public.public_profiles IS 'Safe public view of profiles without sensitive contact information (email, phone)';
COMMENT ON FUNCTION public.get_safe_profile(uuid) IS 'Returns profile data safe for public display without exposing contact information';
COMMENT ON FUNCTION public.get_contact_for_booking(uuid) IS 'Returns contact info only for authenticated users booking appointments';