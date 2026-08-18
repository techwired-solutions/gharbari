import Link from "next/link";
import { MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { propertyTypeHasBedrooms, type PublicListing } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/constants";
import { getListingUrl } from "@/lib/site-url";
import { ShareButton } from "@/components/ShareButton";
import type { translations } from "@/lib/translations";

const typeStyles: Record<PublicListing["listing_type"], string> = {
  Buy: "bg-[#e5f0e9] text-leaf-dark",
  Rent: "bg-[#e5f0e9] text-leaf-dark",
  Sell: "bg-[#f7e8dd] text-clay-dark",
  "Rent out": "bg-[#f7e8dd] text-clay-dark",
};

export function ListingCard({
  listing,
  t,
}: {
  listing: PublicListing;
  t: (typeof translations)["en"];
}) {
  const [coverImage, ...restImages] = listing.image_urls ?? [];
  const href = `/listing/${listing.id}`;

  return (
    <article className="listing-card overflow-hidden rounded-2xl border border-[#dce2dc] bg-white shadow-sm transition hover:shadow-md">
      <Link href={href} className="block no-underline">
        {coverImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-dim">
            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase Storage URL, not a local asset */}
            <img src={coverImage} alt={listing.property_type} className="h-full w-full object-cover" />
            {restImages.length > 0 && (
              <span className="absolute bottom-2 right-2 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-bold text-white">
                +{restImages.length}
              </span>
            )}
          </div>
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-sand-dim text-ink/25">
            <MapPin className="h-8 w-8" />
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeStyles[listing.listing_type]}`}
          >
            {listing.listing_type}
          </span>
          <ShareButton
            url={getListingUrl(listing.id)}
            title={`${listing.property_type} in ${listing.location} — GharBari`}
            label={t.share}
            copiedLabel={t.linkCopied}
            iconOnly
          />
        </div>

        <Link href={href} className="no-underline">
          <h3 className="text-xl font-bold text-ink transition hover:text-leaf-dark">{listing.property_type}</h3>
        </Link>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{listing.location}</span>
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

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#e4e8e2] py-4 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBudget}</p>
            <p className="mt-1 font-semibold">
              {listing.price_range}
              {listing.price_negotiable && (
                <span className="ml-1.5 inline-flex rounded-full bg-[#f7e8dd] px-2 py-0.5 text-[10px] font-bold text-clay-dark align-middle">
                  {t.cardNegotiable}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardArea}</p>
            <p className="mt-1 font-semibold">{listing.area || t.optNotSpecified}</p>
          </div>
          {propertyTypeHasBedrooms(listing.property_type) && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBedrooms}</p>
              <p className="mt-1 font-semibold">{listing.bedrooms}</p>
            </div>
          )}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink/70">{listing.description}</p>

        <div className="mt-4 flex gap-2">
          <a
            href={buildWhatsAppLink(listing)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" />
            {t.cardContactWhatsapp}
          </a>
        </div>
      </div>
    </article>
  );
}
