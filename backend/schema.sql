-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Sites Table
create table if not exists sites (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references auth.users not null, -- Links to Supabase Auth User
  name text not null,
  subdomain text unique not null,
  custom_domain text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Folders Table (Organizational)
create table if not exists folders (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  name text not null,
  color text, -- e.g. hex code or tailwind class
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Pages Table
create table if not exists pages (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  folder_id uuid references folders(id) on delete set null,
  
  -- Core Identity
  slug text not null,
  title text,
  type text not null default 'landing', -- landing, system, template
  entity_type text, -- product, collection, blog (only for type=template)
  is_deletable boolean not null default true,
  
  -- Content
  content jsonb default '[]'::jsonb, -- Stores the component tree
  
  -- Status & Scheduling
  status text not null default 'draft', -- draft, published, scheduled, archived
  scheduled_at timestamp with time zone,
  
  -- SEO & Social
  seo_title text,
  seo_description text,
  social_image text, -- URL for OG Image
  schema_markup jsonb default '{}'::jsonb, -- Structured Data
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique (site_id, slug)
);

-- Redirects Table (301/302)
create table if not exists redirects (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  from_path text not null,
  to_path text not null,
  type text default '301', -- 301, 302
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (site_id, from_path)
);

-- Navigation Menus
create table if not exists navigation_menus (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  name text not null, -- e.g. "Main Menu", "Footer"
  items jsonb default '[]'::jsonb, -- Nested JSON structure for menu items
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Policies

-- Enable RLS
alter table sites enable row level security;
alter table pages enable row level security;
alter table folders enable row level security;
alter table redirects enable row level security;
alter table navigation_menus enable row level security;

-- Policies for Sites
create policy "Users can view own sites" on sites for select using (auth.uid() = owner_id);
create policy "Users can insert own sites" on sites for insert with check (auth.uid() = owner_id);
create policy "Users can update own sites" on sites for update using (auth.uid() = owner_id);
create policy "Users can delete own sites" on sites for delete using (auth.uid() = owner_id);

-- Helper Helper for site ownership check
-- Note: Subqueries in RLS can be expensive. For high perf, denormalize owner_id or use other methods.
-- For now, we use the simple exists check.

-- Pages Policies
create policy "Users can manage pages of their own sites" on pages
  for all using (
    exists (
      select 1 from sites
      where sites.id = pages.site_id
      and sites.owner_id = auth.uid()
    )
  );

-- Folders Policies
create policy "Users can manage folders of their own sites" on folders
  for all using (
    exists (
      select 1 from sites
      where sites.id = folders.site_id
      and sites.owner_id = auth.uid()
    )
  );

-- Redirects Policies
create policy "Users can manage redirects of their own sites" on redirects
  for all using (
    exists (
      select 1 from sites
      where sites.id = redirects.site_id
      and sites.owner_id = auth.uid()
    )
  );

-- Navigation Menus Policies
create policy "Users can manage navigation_menus of their own sites" on navigation_menus
  for all using (
    exists (
      select 1 from sites
      where sites.id = navigation_menus.site_id
      and sites.owner_id = auth.uid()
    )
  );
