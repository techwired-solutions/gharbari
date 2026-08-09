"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex rounded-full border border-white/30 bg-black/10 p-1"
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
          lang === "en" ? "bg-white text-ink" : "text-white/85 hover:text-white"
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLang("ne")}
        aria-pressed={lang === "ne"}
        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
          lang === "ne" ? "bg-white text-ink" : "text-white/85 hover:text-white"
        }`}
      >
        नेपाली
      </button>
    </div>
  );
}
