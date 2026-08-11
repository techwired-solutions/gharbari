-- GharBari — migration 001: property photos
-- Run this in the Supabase SQL editor AFTER supabase/schema.sql.

-- 1. New column on listings: up to 4 photo URLs per listing.
alter table listings
  add column if not exists image_urls text[] not null default '{}';

alter table listings
  drop constraint if exists listings_image_urls_max_check;
alter table listings
  add constraint listings_image_urls_max_check
  check (array_length(image_urls, 1) is null or array_length(image_urls, 1) <= 4);

-- 2. Storage bucket for the photos themselves. Public read (so listing
-- images can be displayed with a plain URL), 5MB/file limit, images only —
-- enforced by Supabase Storage itself, not just app code.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 3. Storage RLS: anyone can upload into this bucket (needed for the public
-- submission form) and anyone can read from it (needed to display photos).
-- There is deliberately no public update/delete policy, same pattern as the
-- `listings` table — only the service-role key could remove an object, and
-- nothing in this app currently does that (deleting a listing leaves its
-- photos in storage; harmless, just unused storage on the free tier).
drop policy if exists "Public can upload listing photos" on storage.objects;
create policy "Public can upload listing photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'listing-photos');

drop policy if exists "Public can view listing photos" on storage.objects;
create policy "Public can view listing photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'listing-photos');
