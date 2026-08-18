import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { PUBLIC_LISTING_COLUMNS, type PublicListing } from "@/lib/types";
import { getListingUrl } from "@/lib/site-url";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ListingDetail } from "@/components/ListingDetail";

export const revalidate = 0;

async function getListing(id: string): Promise<PublicListing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_COLUMNS)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as unknown as PublicListing;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return { title: "Listing not found — GharBari" };
  }

  const title = `${listing.property_type} in ${listing.location} — GharBari`;
  const description = listing.description.length > 160 ? `${listing.description.slice(0, 157)}...` : listing.description;
  const image = listing.image_urls?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: getListingUrl(listing.id),
      siteName: "GharBari",
      images: image ? [{ url: image, width: 1200, height: 900 }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) notFound();

  return (
    <LanguageProvider>
      <ListingDetail listing={listing} />
    </LanguageProvider>
  );
}
