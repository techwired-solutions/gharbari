"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RequestSection } from "@/components/RequestSection";
import { RequestForm } from "@/components/RequestForm";
import { ListingsBoard } from "@/components/ListingsBoard";
import { SiteFooter } from "@/components/SiteFooter";
import { Modal } from "@/components/Modal";
import { useLanguage } from "@/components/LanguageProvider";
import { useListingFilters } from "@/hooks/useListingFilters";
import type { PublicListing } from "@/lib/types";

export function PropertyBoard({ initialListings }: { initialListings: PublicListing[] }) {
  const { t } = useLanguage();
  const [listings, setListings] = useState<PublicListing[]>(initialListings);
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const filters = useListingFilters(listings);

  function handleCreated(listing: PublicListing) {
    setListings((prev) => [listing, ...prev]);
  }

  return (
    <>
      <header className="w-full">
        <Hero filters={filters} onOpenQuickForm={() => setQuickFormOpen(true)} />
      </header>
      <main className="w-full">
        <RequestSection onCreated={handleCreated} />
        <ListingsBoard listings={filters.filtered} totalCount={listings.length} filters={filters} />
      </main>
      <SiteFooter />

      {quickFormOpen && (
        <Modal onClose={() => setQuickFormOpen(false)} title={t.navGetStarted}>
          <RequestForm onCreated={handleCreated} variant="bare" idPrefix="quick-" />
        </Modal>
      )}
    </>
  );
}
