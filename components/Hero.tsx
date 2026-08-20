"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SquarePlus } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { HeroArt } from "@/components/HeroArt";
import { SearchFilterPanel } from "@/components/SearchFilterPanel";
import type { useListingFilters } from "@/hooks/useListingFilters";

export function Hero({
  filters,
  onOpenQuickForm,
}: {
  filters: ReturnType<typeof useListingFilters>;
  onOpenQuickForm: () => void;
}) {
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  return (
    <section className="relative min-h-[520px] overflow-hidden">
      <HeroArt />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between gap-3" aria-label="Primary navigation">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-white no-underline">
            {t.brand}
          </a>

          <div className="flex min-w-0 items-center gap-2">
            <div ref={containerRef} className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={t.searchAriaLabel}
                aria-expanded={searchOpen}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                  searchOpen ? "border-white bg-white text-ink" : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <Search className="h-4 w-4" />
              </button>
              {searchOpen && <SearchFilterPanel filters={filters} onClose={() => setSearchOpen(false)} />}
            </div>

            <LanguageToggle />
            <button
              type="button"
              onClick={onOpenQuickForm}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-bold text-ink no-underline transition hover:bg-white/90 sm:px-4"
            >
              <SquarePlus className="h-4 w-4 text-leaf" />
              <span className="hidden sm:inline">{t.navGetStarted}</span>
            </button>
          </div>
        </nav>

        <div id="top" className="max-w-2xl py-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#d7f0df]">
            {t.heroKicker}
          </p>
          <h1 className="font-display mb-5 max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            {t.heroTitle}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/85">{t.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white">
              {t.heroFeatureOne}
            </span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white">
              {t.heroFeatureTwo}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
