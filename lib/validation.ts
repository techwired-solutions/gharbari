import { z } from "zod";

export const MAX_LISTING_IMAGES = 4;

// Only accept URLs that actually point into our own listing-photos bucket —
// otherwise the image_urls field could be used to store arbitrary hotlinked
// URLs instead of photos that were genuinely uploaded through the app.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const listingPhotoUrlPrefix = `${supabaseUrl}/storage/v1/object/public/listing-photos/`;

const imageUrlSchema = z
  .string()
  .url()
  .refine((url) => url.startsWith(listingPhotoUrlPrefix), {
    message: "Image must be uploaded through the form",
  });

/**
 * Server-side validation for a new listing submission. Mirrors the check
 * constraints in supabase/schema.sql — keep the two in sync.
 */
export const newListingSchema = z.object({
  listing_type: z.enum(["Buy", "Rent", "Sell", "Rent out"]),
  property_type: z.enum(["House", "Land", "Apartment", "Commercial space"]),
  location: z.string().trim().min(1, "Location is required").max(120),
  map_link: z.string().trim().url("Enter a valid link").max(500).optional().or(z.literal("")),
  price_range: z.string().trim().min(1, "Budget / asking price is required").max(60),
  price_negotiable: z.boolean().default(false),
  bedrooms: z
    .enum(["Not specified", "1 bedroom", "2 bedrooms", "3 bedrooms", "4+ bedrooms"])
    .default("Not specified"),
  area: z.string().trim().max(60).optional().or(z.literal("")),
  description: z.string().trim().min(1, "Property details are required").max(1000),
  contact_name: z.string().trim().min(1, "Your name is required").max(80),
  contact_number: z
    .string()
    .trim()
    .min(6, "Enter a valid contact number")
    .max(20, "Enter a valid contact number")
    .regex(/^[0-9+\-\s()]+$/, "Enter a valid contact number"),
  image_urls: z.array(imageUrlSchema).max(MAX_LISTING_IMAGES, "Up to 4 photos only").default([]),
  // Honeypot field — real visitors never fill this in. Bots that
  // autofill every input will, and we silently drop the submission.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  // How many ms elapsed between the form rendering and the submit event.
  // Bots tend to submit near-instantly; real people take a few seconds.
  formOpenedAt: z.number().optional(),
});

export type NewListingPayload = z.infer<typeof newListingSchema>;

export const MIN_FILL_TIME_MS = 1500;
