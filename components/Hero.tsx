"use client";

import { useRef, useState } from "react";
import { Home, Search, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { HeroArt } from "@/components/HeroArt";

export function Hero({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  const { t } = useLanguage();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    setSearchOpen(true);
    // Focus after the input mounts, then jump straight to the results so
    // typing here feels like it does something immediately.
    requestAnimationFrame(() => searchInputRef.current?.focus());
    document.getElementById("community-board")?.scrollIntoView({ behavior: "smooth" });
  }

  function closeSearch() {
    setSearchOpen(false);
    onSearchChange("");
  }

  return (
    <section className="relative min-h-[520px] overflow-hidden">
      <HeroArt />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between gap-3" aria-label="Primary navigation">
          <a href="#top" className="flex items-center gap-2 text-white no-underline">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Home className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">{t.brand}</span>
          </a>

          <div className="flex min-w-0 items-center gap-2">
            {searchOpen ? (
              <div className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/15 pl-3 pr-1.5">
                <Search className="h-4 w-4 shrink-0 text-white/70" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-32 min-w-0 bg-transparent py-2 text-sm text-white placeholder:text-white/60 outline-none sm:w-56"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openSearch}
                aria-label={t.searchAriaLabel}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
            <LanguageToggle />
            <a
              className="hidden shrink-0 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-white/10 sm:inline-block"
              href="#list-property"
            >
              {t.navList}
            </a>
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
