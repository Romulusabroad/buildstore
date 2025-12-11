-- 1. Add new columns
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'type') then
    alter table pages add column type text not null default 'landing'; -- landing, system, template
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'entity_type') then
    alter table pages add column entity_type text; -- product, collection, blog (only for type=template)
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'pages' and column_name = 'is_deletable') then
    alter table pages add column is_deletable boolean not null default true;
  end if;
end $$;

-- 2. Ensure System pages exist (Seeding via SQL for immediate effect, backend will also enforce)
-- This part is optional if backend seeding handles it, but good for data integrity now.
-- We'll let the backend application logic handle the specific row creation to ensure UUID handling is consistent.
