-- Update the public_profiles view to include banner_url
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
  banner_url,
  social_accounts,
  updated_at
FROM public.profiles;

-- Grant public access to the safe view
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;
