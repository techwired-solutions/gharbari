"use client";

import { useMemo, useState } from "react";
import { listingMatchesQuery } from "@/lib/search";
import {
  CATEGORY_LISTING_TYPES,
  propertyTypeHasBedrooms,
  type Bedrooms,
  type ListingCategory,
  type PropertyType,
  type PublicListing,
} from "@/lib/types";

/**
 * Single source of truth for the community board's search/category/filter
 * state — shared between the board's own filter bar and the nav's
 * quick-access search panel so the two never drift out of sync.
 */
export function useListingFilters(listings: PublicListing[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<ListingCategory>("all");
  const [propertyType, setPropertyTypeState] = useState<PropertyType | "all">("all");
  const [bedrooms, setBedrooms] = useState<Bedrooms | "all">("all");

  function setPropertyType(next: PropertyType | "all") {
    setPropertyTypeState(next);
    // Land/Commercial space never have bedrooms — drop a stale selection
    // rather than leave an invisible filter silently zeroing out results.
    if (next !== "all" && !propertyTypeHasBedrooms(next)) {
      setBedrooms("all");
    }
  }

  const searched = useMemo(
    () => listings.filter((listing) => listingMatchesQuery(listing, searchQuery)),
    [listings, searchQuery]
  );

  const counts = useMemo(
    () => ({
      all: searched.length,
      requests: searched.filter((l) => CATEGORY_LISTING_TYPES.requests.includes(l.listing_type)).length,
      listings: searched.filter((l) => CATEGORY_LISTING_TYPES.listings.includes(l.listing_type)).length,
    }),
    [searched]
  );

  const filtered = useMemo(() => {
    return searched.filter((listing) => {
      if (category !== "all" && !CATEGORY_LISTING_TYPES[category].includes(listing.listing_type)) return false;
      if (propertyType !== "all" && listing.property_type !== propertyType) return false;
      if (bedrooms !== "all" && listing.bedrooms !== bedrooms) return false;
      return true;
    });
  }, [searched, category, propertyType, bedrooms]);

  return {
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    propertyType,
    setPropertyType,
    bedrooms,
    setBedrooms,
    filtered,
    counts,
  };
}
