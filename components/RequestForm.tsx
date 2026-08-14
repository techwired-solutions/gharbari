"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Building2, Search } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { ImagePicker } from "@/components/ImagePicker";
import type { Copy } from "@/lib/translations";
import { propertyTypeHasBedrooms, type PublicListing, type ListingType, type PropertyType, type Bedrooms } from "@/lib/types";

type Mode = "find" | "list";
type Status = { kind: "idle" | "info" | "success" | "error"; message: string };

const emptyStatus: Status = { kind: "idle", message: "" };

// A "find" request only makes sense as Buy/Rent; a "list" request only makes
// sense as Sell/Rent out — showing all four options in both modes let people
// submit contradictory combinations (e.g. "Sell" while on the Find tab).
const LISTING_TYPES_BY_MODE: Record<Mode, ListingType[]> = {
  find: ["Buy", "Rent"],
  list: ["Sell", "Rent out"],
};

export function RequestForm({ onCreated }: { onCreated: (listing: PublicListing) => void }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("find");
  const [listingType, setListingType] = useState<ListingType>("Buy");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [bedrooms, setBedrooms] = useState<Bedrooms>("Not specified");
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(emptyStatus);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const openedAt = useRef(0);

  const showBedrooms = propertyTypeHasBedrooms(propertyType);
  // A photo is something you have of a property you're listing, not
  // something you'd attach to a request to find one.
  const showPhotos = mode === "list";

  // Recorded as a side effect (not during render) — read by lib/validation's
  // fill-time check to help distinguish real visitors from bots.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function handleModeChange(next: Mode) {
    setMode(next);
    setListingType(next === "find" ? "Buy" : "Sell");
    if (next === "find") setImageUrls([]);
  }

  function handlePropertyTypeChange(next: PropertyType) {
    setPropertyType(next);
    if (!propertyTypeHasBedrooms(next)) {
      setBedrooms("Not specified");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real visitors never see or fill this field.
    if ((data.get("website") as string)?.length) {
      setStatus({ kind: "error", message: t.statusError });
      return;
    }

    const payload = {
      listing_type: listingType,
      property_type: propertyType,
      location: (data.get("location") as string)?.trim(),
      map_link: (data.get("map_link") as string)?.trim() || undefined,
      price_range: (data.get("price_range") as string)?.trim(),
      price_negotiable: priceNegotiable,
      bedrooms,
      area: (data.get("area") as string)?.trim() || undefined,
      description: (data.get("description") as string)?.trim(),
      contact_name: (data.get("contact_name") as string)?.trim(),
      contact_number: (data.get("contact_number") as string)?.trim(),
      image_urls: showPhotos ? imageUrls : [],
      formOpenedAt: openedAt.current,
    };

    if (
      !payload.property_type ||
      !payload.location ||
      !payload.price_range ||
      !payload.description ||
      !payload.contact_name ||
      !payload.contact_number
    ) {
      setStatus({ kind: "error", message: t.statusValidation });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: "info", message: t.submitting });

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("request failed");
      const { listing } = (await res.json()) as { listing: PublicListing };

      onCreated(listing);
      form.reset();
      setImageUrls([]);
      setPropertyType("");
      setBedrooms("Not specified");
      setPriceNegotiable(false);
      openedAt.current = Date.now();
      handleModeChange("find");
      setStatus({ kind: "success", message: t.statusSuccess });
    } catch {
      setStatus({ kind: "error", message: t.statusError });
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor =
    status.kind === "error"
      ? "text-clay-dark"
      : status.kind === "success"
        ? "text-leaf"
        : "text-ink/60";

  return (
    <section
      id="list-property"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(23,49,43,.10)] sm:p-8"
      aria-labelledby="form-heading"
    >
      <h2 id="form-heading" className="sr-only">
        Property request form
      </h2>

      <div className="mb-7 flex rounded-2xl bg-sand-dim p-1.5" role="tablist" aria-label="Property request type">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "find"}
          onClick={() => handleModeChange("find")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            mode === "find" ? "bg-leaf text-white shadow-[0_8px_18px_rgba(36,106,85,.22)]" : "text-ink/65"
          }`}
        >
          <Search className="h-4 w-4" />
          {t.tabFind}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "list"}
          onClick={() => handleModeChange("list")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            mode === "list" ? "bg-leaf text-white shadow-[0_8px_18px_rgba(36,106,85,.22)]" : "text-ink/65"
          }`}
        >
          <Building2 className="h-4 w-4" />
          {t.tabList}
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        {/* Honeypot — visually hidden from real users, catnip for bots. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.fieldListingType} htmlFor="listing_type">
            <select
              id="listing_type"
              name="listing_type"
              value={listingType}
              onChange={(e) => setListingType(e.target.value as ListingType)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15"
            >
              {LISTING_TYPES_BY_MODE[mode].map((option) => (
                <option key={option} value={option}>
                  {listingTypeLabel(option, t)}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.fieldPropertyType} htmlFor="property_type">
            <select
              id="property_type"
              name="property_type"
              required
              value={propertyType}
              onChange={(e) => handlePropertyTypeChange(e.target.value as PropertyType)}
              className={selectClass}
            >
              <option value="" disabled>
                {t.optSelectPropertyType}
              </option>
              <option value="House">{t.optHouse}</option>
              <option value="Land">{t.optLand}</option>
              <option value="Apartment">{t.optApartment}</option>
              <option value="Commercial space">{t.optCommercial}</option>
            </select>
          </Field>

          <Field label={t.fieldLocation} htmlFor="location">
            <input
              id="location"
              name="location"
              required
              maxLength={120}
              placeholder={t.placeholderLocation}
              className={inputClass}
            />
          </Field>

          <Field label={t.fieldMapLink} htmlFor="map_link">
            <input
              id="map_link"
              name="map_link"
              type="url"
              maxLength={500}
              placeholder={t.placeholderMapLink}
              className={inputClass}
            />
          </Field>

          <Field label={t.fieldPrice} htmlFor="price_range">
            <div className="flex gap-2">
              <input
                id="price_range"
                name="price_range"
                required
                maxLength={60}
                placeholder={t.placeholderPrice}
                className={inputClass}
              />
              <div className="flex shrink-0 rounded-xl bg-sand-dim p-1 text-xs font-bold">
                <button
                  type="button"
                  aria-pressed={!priceNegotiable}
                  onClick={() => setPriceNegotiable(false)}
                  className={`rounded-lg px-3 py-2 transition ${
                    !priceNegotiable ? "bg-white text-ink shadow-sm" : "text-ink/50"
                  }`}
                >
                  {t.priceFixed}
                </button>
                <button
                  type="button"
                  aria-pressed={priceNegotiable}
                  onClick={() => setPriceNegotiable(true)}
                  className={`rounded-lg px-3 py-2 transition ${
                    priceNegotiable ? "bg-white text-ink shadow-sm" : "text-ink/50"
                  }`}
                >
                  {t.priceNegotiable}
                </button>
              </div>
            </div>
          </Field>

          {showBedrooms && (
            <Field label={t.fieldBedrooms} htmlFor="bedrooms">
              <select
                id="bedrooms"
                name="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value as Bedrooms)}
                className={selectClass}
              >
                <option value="Not specified">{t.optNotSpecified}</option>
                <option value="1 bedroom">{t.opt1Bed}</option>
                <option value="2 bedrooms">{t.opt2Bed}</option>
                <option value="3 bedrooms">{t.opt3Bed}</option>
                <option value="4+ bedrooms">{t.opt4Bed}</option>
              </select>
            </Field>
          )}

          <Field label={t.fieldArea} htmlFor="area">
            <input id="area" name="area" maxLength={60} placeholder={t.placeholderArea} className={inputClass} />
          </Field>

          <div className="sm:col-span-2">
            <Field label={t.fieldDescription} htmlFor="description">
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={1000}
                placeholder={t.placeholderDescription}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </div>

          {showPhotos && (
            <div className="sm:col-span-2">
              <ImagePicker
                value={imageUrls}
                onChange={setImageUrls}
                label={t.fieldPhotos}
                helpText={t.photosHelp}
              />
            </div>
          )}

          <Field label={t.fieldName} htmlFor="contact_name">
            <input
              id="contact_name"
              name="contact_name"
              required
              maxLength={80}
              autoComplete="name"
              placeholder={t.placeholderName}
              className={inputClass}
            />
          </Field>

          <div>
            <Field label={t.fieldNumber} htmlFor="contact_number">
              <input
                id="contact_number"
                name="contact_number"
                type="tel"
                required
                maxLength={20}
                autoComplete="tel"
                placeholder={t.placeholderNumber}
                className={inputClass}
              />
            </Field>
            <p className="mt-1.5 text-xs text-ink/45">{t.contactPrivacyNote}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`min-h-6 text-sm ${statusColor}`} aria-live="polite">
            {status.message}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-leaf px-6 py-3.5 text-sm font-bold text-white transition hover:bg-leaf-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    </section>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3.5 text-sm outline-none transition focus:border-leaf focus:ring-4 focus:ring-leaf/15";
const selectClass = inputClass;

function listingTypeLabel(type: ListingType, t: Copy): string {
  switch (type) {
    case "Buy":
      return t.optBuy;
    case "Rent":
      return t.optRent;
    case "Sell":
      return t.optSell;
    case "Rent out":
      return t.optRentOut;
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-bold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
