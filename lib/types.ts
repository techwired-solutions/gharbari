export type ListingType = "Buy" | "Rent" | "Sell" | "Rent out";

export type PropertyType = "House" | "Land" | "Apartment" | "Commercial space";

export type Bedrooms =
  | "Not specified"
  | "1 bedroom"
  | "2 bedrooms"
  | "3 bedrooms"
  | "4+ bedrooms";

/** A single row in the `listings` table, as stored in Supabase. */
export interface Listing {
  id: string;
  listing_type: ListingType;
  property_type: PropertyType;
  location: string;
  map_link: string | null;
  price_range: string;
  price_negotiable: boolean;
  bedrooms: Bedrooms;
  area: string | null;
  description: string;
  contact_name: string;
  contact_number: string;
  image_urls: string[];
  created_at: string;
}

/** Shape submitted by the public request form. */
export type NewListingInput = Omit<Listing, "id" | "created_at">;

/**
 * What the public site (page.tsx, /api/listings) ever fetches or renders —
 * deliberately missing contact_name/contact_number. GharBari relays contact
 * through a fixed broker WhatsApp number instead of publishing a
 * submitter's real info; this type makes "the public board doesn't have
 * this field at all" a compile-time fact, not just a rendering choice.
 * Enforced for real at the database level too — see
 * supabase/migration_003_public_contact_privacy.sql, which revokes the
 * anon role's SELECT on those two columns entirely.
 */
export type PublicListing = Omit<Listing, "contact_name" | "contact_number">;

/** Column list matching the anon role's SELECT grant — keep in sync with
 * supabase/migration_003_public_contact_privacy.sql. */
export const PUBLIC_LISTING_COLUMNS =
  "id,listing_type,property_type,location,map_link,price_range,price_negotiable,bedrooms,area,description,image_urls,created_at";

/** Strips contact_name/contact_number before a Listing (fetched server-side
 * with the full row) is sent back in a public-facing response. */
export function toPublicListing(listing: Listing): PublicListing {
  return {
    id: listing.id,
    listing_type: listing.listing_type,
    property_type: listing.property_type,
    location: listing.location,
    map_link: listing.map_link,
    price_range: listing.price_range,
    price_negotiable: listing.price_negotiable,
    bedrooms: listing.bedrooms,
    area: listing.area,
    description: listing.description,
    image_urls: listing.image_urls,
    created_at: listing.created_at,
  };
}

export const LISTING_TYPES: ListingType[] = ["Buy", "Rent", "Sell", "Rent out"];
export const PROPERTY_TYPES: PropertyType[] = [
  "House",
  "Land",
  "Apartment",
  "Commercial space",
];
export const BEDROOM_OPTIONS: Bedrooms[] = [
  "Not specified",
  "1 bedroom",
  "2 bedrooms",
  "3 bedrooms",
  "4+ bedrooms",
];

// Bedrooms only makes sense for a place people actually live in — not land
// or a commercial space. Used to conditionally show/hide the field and stat
// across the request form, admin form, and both read-only displays.
export const PROPERTY_TYPES_WITH_BEDROOMS: PropertyType[] = ["House", "Apartment"];
export function propertyTypeHasBedrooms(type: PropertyType | ""): boolean {
  return PROPERTY_TYPES_WITH_BEDROOMS.includes(type as PropertyType);
}
