"use client";

import { useState, type FormEvent } from "react";
import {
  BEDROOM_OPTIONS,
  LISTING_TYPES,
  PROPERTY_TYPES,
  propertyTypeHasBedrooms,
  type NewListingInput,
  type PropertyType,
} from "@/lib/types";
import { ImagePicker } from "@/components/ImagePicker";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15";

export type ListingFormValues = NewListingInput;

const emptyValues: ListingFormValues = {
  listing_type: "Buy",
  property_type: "House",
  location: "",
  map_link: "",
  price_range: "",
  price_negotiable: false,
  bedrooms: "Not specified",
  area: "",
  description: "",
  contact_name: "",
  contact_number: "",
  image_urls: [],
};

export function AdminListingForm({
  initialValues,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: {
  initialValues?: ListingFormValues;
  submitLabel: string;
  busy: boolean;
  onSubmit: (values: ListingFormValues) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ListingFormValues>(initialValues ?? emptyValues);
  const showBedrooms = propertyTypeHasBedrooms(values.property_type);

  function update<K extends keyof ListingFormValues>(key: K, value: ListingFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updatePropertyType(next: PropertyType) {
    setValues((prev) => ({
      ...prev,
      property_type: next,
      bedrooms: propertyTypeHasBedrooms(next) ? prev.bedrooms : "Not specified",
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Type</span>
        <select
          className={inputClass}
          value={values.listing_type}
          onChange={(e) => update("listing_type", e.target.value as ListingFormValues["listing_type"])}
        >
          {LISTING_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Property type</span>
        <select
          className={inputClass}
          value={values.property_type}
          onChange={(e) => updatePropertyType(e.target.value as PropertyType)}
        >
          {PROPERTY_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Location</span>
        <input
          required
          maxLength={120}
          className={inputClass}
          value={values.location}
          onChange={(e) => update("location", e.target.value)}
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Google Maps link</span>
        <input
          type="url"
          maxLength={500}
          className={inputClass}
          value={values.map_link ?? ""}
          onChange={(e) => update("map_link", e.target.value)}
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Budget / price</span>
        <input
          required
          maxLength={60}
          className={inputClass}
          value={values.price_range}
          onChange={(e) => update("price_range", e.target.value)}
        />
      </label>

      <label className="flex items-end gap-2 pb-2.5 text-sm">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-line accent-leaf"
          checked={values.price_negotiable}
          onChange={(e) => update("price_negotiable", e.target.checked)}
        />
        <span className="font-semibold text-ink">Price is negotiable</span>
      </label>

      {showBedrooms && (
        <label className="text-sm">
          <span className="mb-1 block font-semibold text-ink">Bedrooms</span>
          <select
            className={inputClass}
            value={values.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value as ListingFormValues["bedrooms"])}
          >
            {BEDROOM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Area</span>
        <input
          maxLength={60}
          className={inputClass}
          value={values.area ?? ""}
          onChange={(e) => update("area", e.target.value)}
        />
      </label>

      <label className="text-sm sm:col-span-2">
        <span className="mb-1 block font-semibold text-ink">Description</span>
        <textarea
          required
          rows={3}
          maxLength={1000}
          className={`${inputClass} resize-y`}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </label>

      <div className="sm:col-span-2">
        <ImagePicker
          value={values.image_urls}
          onChange={(image_urls) => update("image_urls", image_urls)}
          label="Photos"
          helpText="Up to 4 photos, 5MB each."
        />
      </div>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Contact name</span>
        <input
          required
          maxLength={80}
          className={inputClass}
          value={values.contact_name}
          onChange={(e) => update("contact_name", e.target.value)}
        />
      </label>

      <label className="text-sm">
        <span className="mb-1 block font-semibold text-ink">Contact number</span>
        <input
          required
          maxLength={20}
          className={inputClass}
          value={values.contact_number}
          onChange={(e) => update("contact_number", e.target.value)}
        />
      </label>

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-leaf px-4 py-2 text-sm font-bold text-white transition hover:bg-leaf-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-sand-dim"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
