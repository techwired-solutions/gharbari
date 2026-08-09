"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-ink px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-white">{t.footerText}</p>
        <p className="text-white/70">{t.footerNote}</p>
      </div>
    </footer>
  );
}
