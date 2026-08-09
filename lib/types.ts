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
  price_range: string;
  bedrooms: Bedrooms;
  area: string | null;
  description: string;
  contact_name: string;
  contact_number: string;
  created_at: string;
}

/** Shape submitted by the public request form. */
export type NewListingInput = Omit<Listing, "id" | "created_at">;

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
