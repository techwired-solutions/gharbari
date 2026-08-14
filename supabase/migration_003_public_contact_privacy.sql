-- GharBari — migration 003: stop leaking submitter contact info publicly
--
-- Until now, the anon (public) key could SELECT every column on `listings`,
-- including contact_name/contact_number. The app UI never rendered them,
-- but that's not real security — anyone with the public anon key (which is
-- necessarily embedded in the browser bundle) could read every submitter's
-- name and phone number directly from Supabase's REST API, or from the
-- page's hydration payload. This enforces it at the database level: the
-- anon role can no longer read those two columns at all, full stop.
--
-- Admin routes are unaffected — they use the service-role key, which
-- bypasses RLS and column grants entirely.

revoke select on listings from anon;

grant select (
  id,
  listing_type,
  property_type,
  location,
  map_link,
  price_range,
  price_negotiable,
  bedrooms,
  area,
  description,
  image_urls,
  created_at
) on listings to anon;
