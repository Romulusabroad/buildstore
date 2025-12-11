
-- Products Table
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  site_id uuid references sites(id) on delete cascade not null,
  
  -- Core Product Data
  title text not null,
  slug text not null,
  price decimal(10, 2) default 0.00,
  compare_at_price decimal(10, 2), -- Original price for sales
  description text,
  images text[] default array[]::text[],
  sku text,
  inventory_quantity integer default 0,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique (site_id, slug)
);

-- RLS for Products
alter table products enable row level security;

create policy "Users can manage products of their own sites" on products
  for all using (
    exists (
      select 1 from sites
      where sites.id = products.site_id
      and sites.owner_id = auth.uid()
    )
  );
