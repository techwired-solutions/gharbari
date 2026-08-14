import { supabase } from "@/lib/supabase";
import { LanguageProvider } from "@/components/LanguageProvider";
import { PropertyBoard } from "@/components/PropertyBoard";
import { PUBLIC_LISTING_COLUMNS, type PublicListing } from "@/lib/types";

export const revalidate = 0;

async function getListings(): Promise<PublicListing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Failed to load listings", error.message);
    return [];
  }
  return (data ?? []) as unknown as PublicListing[];
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <LanguageProvider>
      <PropertyBoard initialListings={listings} />
    </LanguageProvider>
  );
}
