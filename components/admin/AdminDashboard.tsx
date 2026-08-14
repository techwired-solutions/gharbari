"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, LogOut, Plus, Search } from "lucide-react";
import type { Listing } from "@/lib/types";
import { listingMatchesQuery } from "@/lib/search";
import { AdminListingForm, type ListingFormValues } from "@/components/admin/AdminListingForm";
import { AdminListingRow } from "@/components/admin/AdminListingRow";

type LoadState = "loading" | "ready" | "error";

export function AdminDashboard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [creatingBusy, setCreatingBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void loadListings();
  }, []);

  async function loadListings() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/listings");
      if (!res.ok) throw new Error();
      const { listings } = (await res.json()) as { listings: Listing[] };
      setListings(listings);
      setState("ready");
    } catch {
      setState("error");
    }
  }

  async function handleCreate(values: ListingFormValues) {
    setCreatingBusy(true);
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      const { listing } = (await res.json()) as { listing: Listing };
      setListings((prev) => [listing, ...prev]);
      setCreating(false);
      setNotice("Listing created.");
    } catch {
      setNotice("Could not create the listing. Please try again.");
    } finally {
      setCreatingBusy(false);
    }
  }

  async function handleSave(id: string, values: ListingFormValues) {
    const res = await fetch(`/api/admin/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setNotice("Could not save changes. Please try again.");
      return;
    }
    const { listing } = (await res.json()) as { listing: Listing };
    setListings((prev) => prev.map((item) => (item.id === id ? listing : item)));
    setNotice("Changes saved.");
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setNotice("Could not delete the listing. Please try again.");
      return;
    }
    setListings((prev) => prev.filter((item) => item.id !== id));
    setNotice("Listing deleted.");
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const filtered = useMemo(
    () => listings.filter((listing) => listingMatchesQuery(listing, query)),
    [listings, query]
  );

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <div className="min-h-screen bg-sand-dim">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4f0e9] text-leaf-dark">
              <Home className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-none text-ink">GharBari admin</p>
              <p className="text-xs text-ink/50">Signed in as {adminName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink/70 transition hover:bg-sand-dim"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {notice && (
          <div className="mb-5 rounded-xl bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf-dark" role="status">
            {notice}
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Listings</h1>
            <p className="text-sm text-ink/60">
              {state === "ready" && `${listings.length} listing${listings.length === 1 ? "" : "s"} total`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreating((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-leaf px-4 py-2.5 text-sm font-bold text-white transition hover:bg-leaf-dark"
          >
            <Plus className="h-4 w-4" />
            Add listing
          </button>
        </div>

        {creating && (
          <div className="mb-6 rounded-2xl border border-leaf/30 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="mb-3 text-sm font-bold text-ink">New listing</h2>
            <AdminListingForm
              submitLabel="Create listing"
              busy={creatingBusy}
              onSubmit={handleCreate}
              onCancel={() => setCreating(false)}
            />
          </div>
        )}

        <div className="relative mb-6 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location, name, phone…"
            className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-leaf focus:ring-4 focus:ring-leaf/15"
          />
        </div>

        {state === "loading" && <p className="text-sm text-ink/60">Loading listings…</p>}
        {state === "error" && (
          <p className="text-sm text-clay-dark">
            Could not load listings.{" "}
            <button onClick={() => void loadListings()} className="font-semibold underline">
              Try again
            </button>
          </p>
        )}
        {state === "ready" && filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#c9d5cd] bg-white/70 px-6 py-12 text-center text-ink/60">
            {listings.length === 0 ? "No listings yet." : "No listings match your search."}
          </p>
        )}

        {state === "ready" && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((listing) => (
              <AdminListingRow key={listing.id} listing={listing} onSave={handleSave} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
