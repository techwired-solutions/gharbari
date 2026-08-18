"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  BEDROOM_OPTIONS,
  PROPERTY_TYPES,
  type Bedrooms,
  type ListingCategory,
  type PropertyType,
} from "@/lib/types";

const selectClass =
  "rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15";

export function ListingFilters({
  category,
  onCategoryChange,
  propertyType,
  onPropertyTypeChange,
  bedrooms,
  onBedroomsChange,
  counts,
}: {
  category: ListingCategory;
  onCategoryChange: (category: ListingCategory) => void;
  propertyType: PropertyType | "all";
  onPropertyTypeChange: (type: PropertyType | "all") => void;
  bedrooms: Bedrooms | "all";
  onBedroomsChange: (bedrooms: Bedrooms | "all") => void;
  counts: { all: number; requests: number; listings: number };
}) {
  const { t } = useLanguage();

  const categories: { value: ListingCategory; label: string; count: number }[] = [
    { value: "all", label: t.categoryAll, count: counts.all },
    { value: "requests", label: t.categoryRequests, count: counts.requests },
    { value: "listings", label: t.categoryListings, count: counts.listings },
  ];

  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.categoryAll}>
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={category === c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              category === c.value
                ? "bg-leaf text-white shadow-[0_6px_14px_rgba(36,106,85,.22)]"
                : "bg-white text-ink/60 hover:text-ink"
            }`}
          >
            {c.label}
            <span className={category === c.value ? "text-white/75" : "text-ink/35"}> · {c.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={propertyType}
          onChange={(e) => onPropertyTypeChange(e.target.value as PropertyType | "all")}
          className={selectClass}
          aria-label={t.fieldPropertyType}
        >
          <option value="all">{t.filterAllTypes}</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {propertyTypeLabel(type, t)}
            </option>
          ))}
        </select>

        <select
          value={bedrooms}
          onChange={(e) => onBedroomsChange(e.target.value as Bedrooms | "all")}
          className={selectClass}
          aria-label={t.fieldBedrooms}
        >
          <option value="all">{t.filterAnyBedrooms}</option>
          {BEDROOM_OPTIONS.filter((b) => b !== "Not specified").map((b) => (
            <option key={b} value={b}>
              {bedroomLabel(b, t)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function propertyTypeLabel(type: PropertyType, t: ReturnType<typeof useLanguage>["t"]): string {
  switch (type) {
    case "House":
      return t.optHouse;
    case "Land":
      return t.optLand;
    case "Apartment":
      return t.optApartment;
    case "Commercial space":
      return t.optCommercial;
  }
}

function bedroomLabel(b: Bedrooms, t: ReturnType<typeof useLanguage>["t"]): string {
  switch (b) {
    case "1 bedroom":
      return t.opt1Bed;
    case "2 bedrooms":
      return t.opt2Bed;
    case "3 bedrooms":
      return t.opt3Bed;
    case "4+ bedrooms":
      return t.opt4Bed;
    default:
      return b;
  }
}
