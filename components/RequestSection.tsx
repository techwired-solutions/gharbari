"use client";

import { MapPin, PhoneCall } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { RequestForm } from "@/components/RequestForm";
import type { PublicListing } from "@/lib/types";

export function RequestSection({ onCreated }: { onCreated: (listing: PublicListing) => void }) {
  const { t } = useLanguage();

  return (
    <section className="w-full px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <aside className="pt-2">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-clay">{t.requestEyebrow}</p>
          <h2 className="font-display mb-4 text-2xl font-bold text-ink">{t.requestTitle}</h2>
          <p className="max-w-md leading-relaxed text-ink/65">{t.requestDescription}</p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4f0e9] text-leaf">
                <MapPin className="h-4 w-4" />
              </span>
              <p className="pt-1 text-sm leading-relaxed text-ink/70">{t.benefitLocation}</p>
            </div>
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f7e8dd] text-clay-dark">
                <PhoneCall className="h-4 w-4" />
              </span>
              <p className="pt-1 text-sm leading-relaxed text-ink/70">{t.benefitContact}</p>
            </div>
          </div>
        </aside>

        <RequestForm onCreated={onCreated} />
      </div>
    </section>
  );
}
