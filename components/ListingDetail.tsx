"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ShareButton } from "@/components/ShareButton";
import { SiteFooter } from "@/components/SiteFooter";
import { propertyTypeHasBedrooms, type PublicListing } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/constants";
import { getListingUrl } from "@/lib/site-url";

const typeStyles: Record<PublicListing["listing_type"], string> = {
  Buy: "bg-[#e5f0e9] text-leaf-dark",
  Rent: "bg-[#e5f0e9] text-leaf-dark",
  Sell: "bg-[#f7e8dd] text-clay-dark",
  "Rent out": "bg-[#f7e8dd] text-clay-dark",
};

export function ListingDetail({ listing }: { listing: PublicListing }) {
  const { t } = useLanguage();
  const images = listing.image_urls ?? [];
  const [activeImage, setActiveImage] = useState(0);
  const url = getListingUrl(listing.id);

  return (
    <div className="flex min-h-screen flex-col bg-sand">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-ink no-underline">
            <ArrowLeft className="h-4 w-4" />
            {t.brand}
          </Link>
          <LanguageToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            {images.length > 0 ? (
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sand-dim">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase Storage URL */}
                  <img src={images[activeImage]} alt={listing.property_type} className="h-full w-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="mt-3 flex gap-2">
                    {images.map((url, i) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          i === activeImage ? "border-leaf" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase Storage URL */}
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-sand-dim text-ink/30">
                <MapPin className="h-10 w-10" />
              </div>
            )}

            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-ink/70">{listing.description}</p>
          </div>

          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeStyles[listing.listing_type]}`}>
              {listing.listing_type}
            </span>
            <h1 className="font-display mt-3 text-2xl font-bold text-ink sm:text-3xl">{listing.property_type}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink/65">
              <MapPin className="h-4 w-4 shrink-0" />
              {listing.location}
              {listing.map_link && (
                <a
                  href={listing.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-leaf-dark hover:underline"
                >
                  {t.cardViewOnMap}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBudget}</p>
                <p className="mt-1 text-base font-bold text-ink">
                  {listing.price_range}
                  {listing.price_negotiable && (
                    <span className="ml-1.5 inline-flex rounded-full bg-[#f7e8dd] px-2 py-0.5 align-middle text-[10px] font-bold text-clay-dark">
                      {t.cardNegotiable}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardArea}</p>
                <p className="mt-1 text-base font-bold text-ink">{listing.area || t.optNotSpecified}</p>
              </div>
              {propertyTypeHasBedrooms(listing.property_type) && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBedrooms}</p>
                  <p className="mt-1 text-base font-bold text-ink">{listing.bedrooms}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={buildWhatsAppLink(listing)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition hover:brightness-95"
              >
                <MessageCircle className="h-4 w-4" />
                {t.cardContactWhatsapp}
              </a>
              <ShareButton
                url={url}
                title={`${listing.property_type} in ${listing.location} — GharBari`}
                label={t.shareListing}
                copiedLabel={t.linkCopied}
              />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
