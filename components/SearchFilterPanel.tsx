"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { ListingFilters } from "@/components/ListingFilters";
import type { useListingFilters } from "@/hooks/useListingFilters";

export function SearchFilterPanel({
  filters,
  onClose,
}: {
  filters: ReturnType<typeof useListingFilters>;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the search field once the panel mounts — outside-click/Escape
  // closing is handled by the parent nav, which also owns the trigger
  // button (so a click on the button itself doesn't fight this panel's
  // own open/close state).
  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  function goToResults() {
    document.getElementById("community-board")?.scrollIntoView({ behavior: "smooth" });
    onClose();
  }

  return (
    <div className="fixed inset-x-4 top-20 z-30 rounded-2xl bg-white p-4 text-left shadow-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[26rem]">
      <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-ink/40" />
        <input
          ref={inputRef}
          type="search"
          value={filters.searchQuery}
          onChange={(e) => filters.setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToResults()}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => filters.setSearchQuery("")}
            aria-label="Clear search"
            className="shrink-0 text-ink/40 transition hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4">
        <ListingFilters
          category={filters.category}
          onCategoryChange={filters.setCategory}
          propertyType={filters.propertyType}
          onPropertyTypeChange={filters.setPropertyType}
          bedrooms={filters.bedrooms}
          onBedroomsChange={filters.setBedrooms}
          counts={filters.counts}
        />
      </div>

      <button
        type="button"
        onClick={goToResults}
        className="w-full rounded-xl bg-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-leaf-dark"
      >
        {t.viewResults(filters.filtered.length)}
      </button>
    </div>
  );
}
