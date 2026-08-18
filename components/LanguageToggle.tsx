"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex shrink-0 rounded-full border border-white/30 bg-black/10 p-0.5"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        aria-label="English"
        className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold tracking-wide transition ${
          lang === "en" ? "bg-white text-ink" : "text-white/80 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        aria-label="नेपाली"
        className={`rounded-full px-2.5 py-1.5 text-[11px] font-bold tracking-wide transition ${
          lang === "ne" ? "bg-white text-ink" : "text-white/80 hover:text-white"
        }`}
      >
        NE
      </button>
    </div>
  );
}
