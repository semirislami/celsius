-- Celsius — product category (Split / Multi-Split)
-- Run this in the Supabase SQL editor (Project → SQL → New query → paste → Run)

-- Every product belongs to one family shown as the first choice in the shop.
-- Existing rows default to 'split' (the common wall unit).
alter table public.products
  add column if not exists category text not null default 'split';

create index if not exists products_category_idx on public.products (category);
