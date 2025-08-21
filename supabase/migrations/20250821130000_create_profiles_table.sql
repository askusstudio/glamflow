-- Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  full_name text,
  phone text,
  city text,
  category text,
  services text,
  price_range text,
  bio text,
  portfolio_images text[],
  available_days text[],
  avatar_url text,

  primary key (id),
  constraint bio_length check (char_length(bio) <= 250)
);

alter table public.profiles enable row level security;

-- Allow public read access to profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- Allow users to insert their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- This trigger automatically creates a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage for profile images
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );
