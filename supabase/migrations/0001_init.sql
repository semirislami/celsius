-- Celsius — initial Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL → New query → paste → Run)

create extension if not exists "pgcrypto";

------------------------------------------------------------------
-- Products table
------------------------------------------------------------------
create table if not exists public.products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  description     text not null,
  price_mkd       integer not null check (price_mkd >= 0),
  old_price_mkd   integer check (old_price_mkd >= 0),
  capacity_btu    integer not null check (capacity_btu > 0),
  brand           text not null,
  energy_class    text not null,
  badge           text,
  image_url       text not null,
  guarantee_years integer,
  noise_db        numeric,
  review_count    integer,
  specs           jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_brand_idx       on public.products (brand);
create index if not exists products_capacity_idx    on public.products (capacity_btu);
create index if not exists products_energy_idx      on public.products (energy_class);

------------------------------------------------------------------
-- Row level security: public can read, only service role can write
------------------------------------------------------------------
alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products
  for select
  using (true);

-- No insert/update/delete policies → those operations require the
-- service-role key (used server-side from API routes).

------------------------------------------------------------------
-- Storage bucket for product images
------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Writes/deletes on storage are done with the service-role key.
