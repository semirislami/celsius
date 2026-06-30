-- Celsius — multi-image support (up to 10 photos per product)
-- Run this in the Supabase SQL editor (Project → SQL → New query → paste → Run)

-- 1) Ordered list of photo URLs. image_url stays as the "cover" (= images[0])
--    so existing product cards keep working unchanged.
alter table public.products
  add column if not exists images jsonb not null default '[]'::jsonb;

-- 2) Backfill: existing rows get their single image_url as the first photo.
update public.products
  set images = jsonb_build_array(image_url)
  where (images is null or images = '[]'::jsonb)
    and image_url is not null
    and image_url <> '';
