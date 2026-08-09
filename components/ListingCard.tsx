import { MapPin, Phone } from "lucide-react";
import type { Listing } from "@/lib/types";
import type { translations } from "@/lib/translations";

const typeStyles: Record<Listing["listing_type"], string> = {
  Buy: "bg-[#e5f0e9] text-leaf-dark",
  Rent: "bg-[#e5f0e9] text-leaf-dark",
  Sell: "bg-[#f7e8dd] text-clay-dark",
  "Rent out": "bg-[#f7e8dd] text-clay-dark",
};

export function ListingCard({
  listing,
  t,
}: {
  listing: Listing;
  t: (typeof translations)["en"];
}) {
  return (
    <article className="listing-card rounded-2xl border border-[#dce2dc] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${typeStyles[listing.listing_type]}`}>
          {listing.listing_type}
        </span>
      </div>

      <h3 className="text-xl font-bold text-ink">{listing.property_type}</h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-ink/65">
        <MapPin className="h-4 w-4 shrink-0" />
        <span>{listing.location}</span>
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#e4e8e2] py-4 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBudget}</p>
          <p className="mt-1 font-semibold">{listing.price_range}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardArea}</p>
          <p className="mt-1 font-semibold">{listing.area || t.optNotSpecified}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardBedrooms}</p>
          <p className="mt-1 font-semibold">{listing.bedrooms}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#789087]">{t.cardContact}</p>
          <p className="mt-1 flex items-center gap-1.5 truncate font-semibold">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {listing.contact_name}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/70">{listing.description}</p>
    </article>
  );
}
