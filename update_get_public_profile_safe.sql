-- Update the get_public_profile_safe function to include banner_url
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
  banner_url text,
  social_accounts text
)
LANGUAGE sql
STABLE SECURITY DEFINER
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
    p.banner_url,
    p.social_accounts
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;
