"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RequestSection } from "@/components/RequestSection";
import { ListingsBoard } from "@/components/ListingsBoard";
import { SiteFooter } from "@/components/SiteFooter";
import type { PublicListing } from "@/lib/types";

export function PropertyBoard({ initialListings }: { initialListings: PublicListing[] }) {
  const [listings, setListings] = useState<PublicListing[]>(initialListings);
  const [searchQuery, setSearchQuery] = useState("");

  function handleCreated(listing: PublicListing) {
    setListings((prev) => [listing, ...prev]);
  }

  return (
    <>
      <header className="w-full">
        <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </header>
      <main className="w-full">
        <RequestSection onCreated={handleCreated} />
        <ListingsBoard listings={listings} searchQuery={searchQuery} />
      </main>
      <SiteFooter />
    </>
  );
}
