"use client";

import { Home } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { HeroArt } from "@/components/HeroArt";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[520px] overflow-hidden">
      <HeroArt />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between" aria-label="Primary navigation">
          <a href="#top" className="flex items-center gap-2 text-white no-underline">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Home className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">{t.brand}</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <a
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white no-underline transition hover:bg-white/10"
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
