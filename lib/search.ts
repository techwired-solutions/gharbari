import type { Listing, PublicListing } from "@/lib/types";

// Admin's search matches on the full Listing (including contact info, for
// finding a specific submitter); the public board's search only ever has a
// PublicListing to search, which has no contact fields at all.
type SearchableListing = Listing | PublicListing;

/** Simple case-insensitive substring match across the fields visitors search by. */
export function listingMatchesQuery(listing: SearchableListing, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const fields = [
    listing.location,
    listing.property_type,
    listing.listing_type,
    listing.description,
    listing.price_range,
    "contact_name" in listing ? listing.contact_name : "",
    "contact_number" in listing ? listing.contact_number : "",
  ];
  return fields.join(" ").toLowerCase().includes(q);
}
