import { supabase } from "@/lib/supabase";
import { LanguageProvider } from "@/components/LanguageProvider";
import { PropertyBoard } from "@/components/PropertyBoard";
import type { Listing } from "@/lib/types";

export const revalidate = 0;

async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Failed to load listings", error.message);
    return [];
  }
  return data ?? [];
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <LanguageProvider>
      <PropertyBoard initialListings={listings} />
    </LanguageProvider>
  );
}
