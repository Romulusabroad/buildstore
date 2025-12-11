-- 1. Create new tables (Safe to run if they exist)
create table if not exists folders (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists redirects (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  from_path text not null,
  to_path text not null,
  type text default '301',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (site_id, from_path)
);

create table if not exists navigation_menus (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  name text not null,
  items jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Update Pages Table (Add columns safely)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'folder_id') then
    alter table pages add column folder_id uuid references folders(id) on delete set null;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'status') then
    alter table pages add column status text not null default 'draft';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'scheduled_at') then
    alter table pages add column scheduled_at timestamp with time zone;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'seo_title') then
    alter table pages add column seo_title text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'seo_description') then
    alter table pages add column seo_description text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'social_image') then
    alter table pages add column social_image text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'schema_markup') then
    alter table pages add column schema_markup jsonb default '{}'::jsonb;
  end if;
end $$;

-- 3. Enable RLS on new tables
alter table folders enable row level security;
alter table redirects enable row level security;
alter table navigation_menus enable row level security;

-- 4. Create Policies for NEW tables (Drop first to avoid conflicts)
drop policy if exists "Users can manage folders of their own sites" on folders;
create policy "Users can manage folders of their own sites" on folders
  for all using (
    exists (
      select 1 from sites
      where sites.id = folders.site_id
      and sites.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can manage redirects of their own sites" on redirects;
create policy "Users can manage redirects of their own sites" on redirects
  for all using (
    exists (
      select 1 from sites
      where sites.id = redirects.site_id
      and sites.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can manage navigation_menus of their own sites" on navigation_menus;
create policy "Users can manage navigation_menus of their own sites" on navigation_menus
  for all using (
    exists (
      select 1 from sites
      where sites.id = navigation_menus.site_id
      and sites.owner_id = auth.uid()
    )
  );
