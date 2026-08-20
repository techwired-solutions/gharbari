"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ImagePicker } from "@/components/ImagePicker";
import type { Copy } from "@/lib/translations";
import {
  propertyTypeHasBedrooms,
  listingTypeHasPhotos,
  LISTING_TYPES,
  type PublicListing,
  type ListingType,
  type PropertyType,
  type Bedrooms,
} from "@/lib/types";

type Status = { kind: "idle" | "info" | "success" | "error"; message: string };

const emptyStatus: Status = { kind: "idle", message: "" };

export function RequestForm({
  onCreated,
  variant = "embedded",
  idPrefix = "",
}: {
  onCreated: (listing: PublicListing) => void;
  /** "embedded": renders its own card (used in the page section). "bare":
   * skips the card chrome — used inside Modal, which already supplies it. */
  variant?: "embedded" | "bare";
  /** Prefix for every field id — needed when two instances of this form
   * (e.g. the embedded one and the nav's quick-access modal) can be
   * mounted at once, so ids/htmlFor pairs never collide. */
  idPrefix?: string;
}) {
  const { t } = useLanguage();
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
  const showPhotos = listingTypeHasPhotos(listingType);
  const id = (name: string) => `${idPrefix}${name}`;

  // Recorded as a side effect (not during render) — read by lib/validation's
  // fill-time check to help distinguish real visitors from bots.
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  function handleListingTypeChange(next: ListingType) {
    setListingType(next);
    if (!listingTypeHasPhotos(next)) setImageUrls([]);
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
      setListingType("Buy");
      openedAt.current = Date.now();
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

  const content = (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {/* Honeypot — visually hidden from real users, catnip for bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.fieldListingType} htmlFor={id("listing_type")}>
          <select
            id={id("listing_type")}
            name="listing_type"
            value={listingType}
            onChange={(e) => handleListingTypeChange(e.target.value as ListingType)}
            className={selectClass}
          >
            {LISTING_TYPES.map((option) => (
              <option key={option} value={option}>
                {listingTypeLabel(option, t)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.fieldPropertyType} htmlFor={id("property_type")}>
          <select
            id={id("property_type")}
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

        <Field label={t.fieldLocation} htmlFor={id("location")}>
          <input
            id={id("location")}
            name="location"
            required
            maxLength={120}
            placeholder={t.placeholderLocation}
            className={inputClass}
          />
        </Field>

        <Field label={t.fieldMapLink} htmlFor={id("map_link")}>
          <input
            id={id("map_link")}
            name="map_link"
            type="url"
            maxLength={500}
            placeholder={t.placeholderMapLink}
            className={inputClass}
          />
        </Field>

        <Field label={t.fieldPrice} htmlFor={id("price_range")}>
          <div className="flex gap-2">
            <input
              id={id("price_range")}
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
          <Field label={t.fieldBedrooms} htmlFor={id("bedrooms")}>
            <select
              id={id("bedrooms")}
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

        <Field label={t.fieldArea} htmlFor={id("area")}>
          <input id={id("area")} name="area" maxLength={60} placeholder={t.placeholderArea} className={inputClass} />
        </Field>

        <div className="sm:col-span-2">
          <Field label={t.fieldDescription} htmlFor={id("description")}>
            <textarea
              id={id("description")}
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

        <Field label={t.fieldName} htmlFor={id("contact_name")}>
          <input
            id={id("contact_name")}
            name="contact_name"
            required
            maxLength={80}
            autoComplete="name"
            placeholder={t.placeholderName}
            className={inputClass}
          />
        </Field>

        <div>
          <Field label={t.fieldNumber} htmlFor={id("contact_number")}>
            <input
              id={id("contact_number")}
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
  );

  if (variant === "bare") return content;

  return (
    <section
      id="list-property"
      className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(23,49,43,.10)] sm:p-8"
      aria-labelledby="form-heading"
    >
      <h2 id="form-heading" className="font-display mb-6 text-lg font-bold text-ink">
        {t.requestFormHeading}
      </h2>
      {content}
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
