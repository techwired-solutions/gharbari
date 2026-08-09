"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/types";

export function ListingsBoard({ listings }: { listings: Listing[] }) {
  const { t } = useLanguage();

  const countLabel =
    listings.length === 0
      ? null
      : listings.length === 1
        ? t.listingCountOne
        : t.listingCountMany(listings.length);

  return (
    <section className="w-full bg-sand-dim px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-clay">
              {t.listingsEyebrow}
            </p>
            <h2 className="font-display text-2xl font-bold text-ink">{t.listingsTitle}</h2>
          </div>
          {countLabel && (
            <p className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink/70">
              {countLabel}
            </p>
          )}
        </div>

        {listings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#c9d5cd] bg-white/70 px-6 py-12 text-center leading-relaxed text-ink/70">
            {t.emptyState}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
