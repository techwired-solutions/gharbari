"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RequestSection } from "@/components/RequestSection";
import { ListingsBoard } from "@/components/ListingsBoard";
import { SiteFooter } from "@/components/SiteFooter";
import type { Listing } from "@/lib/types";

export function PropertyBoard({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState<Listing[]>(initialListings);

  function handleCreated(listing: Listing) {
    setListings((prev) => [listing, ...prev]);
  }

  return (
    <>
      <header className="w-full">
        <Hero />
      </header>
      <main className="w-full">
        <RequestSection onCreated={handleCreated} />
        <ListingsBoard listings={listings} />
      </main>
      <SiteFooter />
    </>
  );
}
