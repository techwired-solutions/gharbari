import type { Listing } from "@/lib/types";

/**
 * GharBari acts as the broker between the two sides — visitors never see a
 * submitter's raw contact number, they message this WhatsApp number
 * instead, and staff follow up privately using the number collected in the
 * (unpublished) contact_number field.
 */
export const BROKER_WHATSAPP_NUMBER = "9779843641508"; // E.164, no leading +
export const BROKER_PHONE_DISPLAY = "+977 984-364-1508";

export function buildWhatsAppLink(listing: Pick<Listing, "id" | "property_type" | "location" | "listing_type">): string {
  const message = `Hi, I'm interested in this ${listing.property_type.toLowerCase()} in ${listing.location} (Listing #${listing.id.slice(0, 8)}). Is it still available?`;
  return `https://wa.me/${BROKER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
