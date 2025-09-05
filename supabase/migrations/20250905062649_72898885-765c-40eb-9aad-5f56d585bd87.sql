-- Fix security warnings from the linter

-- Fix WARN 1: Function Search Path Mutable - Set search_path for existing functions

-- Update the handle_new_user function to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Update the update_updated_at_column function (already has search_path set, but ensuring consistency)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$;

-- Update our new functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.get_public_profile_data()
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

CREATE OR REPLACE FUNCTION public.get_profile_for_appointment(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  phone text,
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