import type { Listing } from "@/lib/types";

/** Simple case-insensitive substring match across the fields visitors search by. */
export function listingMatchesQuery(listing: Listing, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    listing.location,
    listing.property_type,
    listing.listing_type,
    listing.description,
    listing.price_range,
    listing.contact_name,
    listing.contact_number,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}
