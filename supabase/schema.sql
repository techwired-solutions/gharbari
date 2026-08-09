-- GharBari — schema for the public listing board.
-- Run this once in the Supabase project's SQL editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  listing_type text not null check (listing_type in ('Buy', 'Rent', 'Sell', 'Rent out')),
  property_type text not null check (property_type in ('House', 'Land', 'Apartment', 'Commercial space')),
  location text not null check (char_length(location) between 1 and 120),
  price_range text not null check (char_length(price_range) between 1 and 60),
  bedrooms text not null default 'Not specified' check (
    bedrooms in ('Not specified', '1 bedroom', '2 bedrooms', '3 bedrooms', '4+ bedrooms')
  ),
  area text check (area is null or char_length(area) <= 60),
  description text not null check (char_length(description) between 1 and 1000),
  contact_name text not null check (char_length(contact_name) between 1 and 80),
  contact_number text not null check (char_length(contact_number) between 6 and 20),
  created_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx on listings (created_at desc);

alter table listings enable row level security;

-- Anyone (the anon key used by the public site) can read all listings.
drop policy if exists "Public can view listings" on listings;
create policy "Public can view listings"
  on listings for select
  to anon
  using (true);

-- Anyone can submit a new listing request. There is deliberately no public
-- update/delete policy — the anon key can never modify or remove a row.
-- Only the service-role key (used server-side by the admin dashboard,
-- app/api/admin/*) can update or delete, because service-role bypasses RLS.
drop policy if exists "Public can submit listings" on listings;
create policy "Public can submit listings"
  on listings for insert
  to anon
  with check (true);
