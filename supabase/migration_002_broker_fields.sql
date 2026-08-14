-- GharBari — migration 002: pricing toggle + map link
-- Run this in the Supabase SQL editor AFTER migration_001_images.sql.

alter table listings
  add column if not exists price_negotiable boolean not null default false;

alter table listings
  add column if not exists map_link text;

alter table listings
  drop constraint if exists listings_map_link_check;
alter table listings
  add constraint listings_map_link_check
  check (map_link is null or char_length(map_link) <= 500);
