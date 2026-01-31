-- RLS on auth.users is managed by Supabase by default.
-- Proceeding with public tables.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  role text not null check (role in ('student', 'admin', 'caretaker')),
  full_name text,
  hostel_block text,
  room_no text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create table public.issues (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  category text not null,
  priority text not null,
  status text default 'reported' check (status in ('reported', 'assigned', 'in_progress', 'resolved', 'closed')),
  location text not null,
  image_url text,
  is_public boolean default true,
  assigned_to text,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.issues enable row level security;

create policy "Issues viewable by everyone if public, or by owner/admin."
  on issues for select
  using ( is_public = true or auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Students can insert issues."
  on issues for insert
  with check ( auth.uid() = user_id );

create policy "Admins can update issues."
  on issues for update
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  issue_id uuid references public.issues(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
  on comments for select
  using ( true );

create policy "Authenticated users can comment."
  on comments for insert
  with check ( auth.role() = 'authenticated' );

create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  category text,
  target_audience text default 'all',
  created_by uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.announcements enable row level security;

create policy "Announcements viewable by everyone."
  on announcements for select
  using ( true );

create policy "Only Admins can insert announcements."
  on announcements for insert
  with check ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create table public.lost_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  location text,
  contact_info text,
  type text not null check (type in ('lost', 'found')),
  status text default 'open' check (status in ('open', 'claimed', 'resolved')),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lost_items enable row level security;

create policy "Lost items viewable by everyone."
  on lost_items for select
  using ( true );

create policy "Users can report lost items."
  on lost_items for insert
  with check ( auth.uid() = user_id );

create policy "Admins or Owner can update."
  on lost_items for update
  using ( auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
