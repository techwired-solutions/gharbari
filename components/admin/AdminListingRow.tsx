"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { propertyTypeHasBedrooms, type Listing } from "@/lib/types";
import { AdminListingForm, type ListingFormValues } from "@/components/admin/AdminListingForm";

export function AdminListingRow({
  listing,
  onSave,
  onDelete,
}: {
  listing: Listing;
  onSave: (id: string, values: ListingFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSave(values: ListingFormValues) {
    setBusy(true);
    try {
      await onSave(listing.id, values);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete(listing.id);
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-leaf/30 bg-white p-4 shadow-sm">
        <AdminListingForm
          initialValues={{
            listing_type: listing.listing_type,
            property_type: listing.property_type,
            location: listing.location,
            map_link: listing.map_link ?? "",
            price_range: listing.price_range,
            price_negotiable: listing.price_negotiable,
            bedrooms: listing.bedrooms,
            area: listing.area ?? "",
            description: listing.description,
            contact_name: listing.contact_name,
            contact_number: listing.contact_number,
            image_urls: listing.image_urls ?? [],
          }}
          submitLabel="Save changes"
          busy={busy}
          onSubmit={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#dce2dc] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-[#e5f0e9] px-3 py-1 text-xs font-bold text-leaf-dark">
            {listing.listing_type}
          </span>
          <h3 className="mt-2 text-lg font-bold text-ink">{listing.property_type}</h3>
          <p className="text-sm text-ink/60">
            {listing.location}
            {listing.map_link && (
              <a
                href={listing.map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 font-semibold text-leaf-dark hover:underline"
              >
                Map ↗
              </a>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-leaf-dark transition hover:bg-[#e5f0e9]"
            aria-label={`Edit ${listing.property_type} listing`}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-clay-dark transition hover:bg-[#fae9e2]"
            aria-label={`Delete ${listing.property_type} listing`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {listing.image_urls && listing.image_urls.length > 0 && (
        <div className="mt-3 flex gap-2">
          {listing.image_urls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic Supabase Storage URL, not a local asset
            <img key={url} src={url} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ))}
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 border-y border-[#e4e8e2] py-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-[#789087]">Budget</dt>
          <dd className="mt-1 font-semibold">
            {listing.price_range}
            {listing.price_negotiable && (
              <span className="ml-1.5 inline-flex rounded-full bg-[#f7e8dd] px-2 py-0.5 text-[10px] font-bold text-clay-dark align-middle">
                Negotiable
              </span>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-[#789087]">Area</dt>
          <dd className="mt-1 font-semibold">{listing.area || "—"}</dd>
        </div>
        {propertyTypeHasBedrooms(listing.property_type) && (
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-[#789087]">Bedrooms</dt>
            <dd className="mt-1 font-semibold">{listing.bedrooms}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-[#789087]">Contact</dt>
          <dd className="mt-1 font-semibold">
            {listing.contact_name} · {listing.contact_number}
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-sm leading-relaxed text-ink/70">{listing.description}</p>
      <p className="mt-3 text-xs text-ink/40">
        Submitted {new Date(listing.created_at).toLocaleString()}
      </p>

      {confirmingDelete && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fae9e2] p-3">
          <span className="text-xs font-semibold text-[#7c3f2d]">Delete this listing permanently?</span>
          <span className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={busy}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-[#704333]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="rounded-lg bg-[#b85837] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
