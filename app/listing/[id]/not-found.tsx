import Link from "next/link";
import { Home, SearchX } from "lucide-react";

export default function ListingNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-5 py-16 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sand-dim text-ink/40">
        <SearchX className="h-7 w-7" />
      </span>
      <h1 className="font-display mb-2 text-2xl font-bold text-ink">Listing not found</h1>
      <p className="mb-8 max-w-sm text-ink/60">
        This property may have been removed, or the link isn&apos;t quite right.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-3 text-sm font-bold text-white no-underline transition hover:bg-leaf-dark"
      >
        <Home className="h-4 w-4" />
        Back to GharBari
      </Link>
    </div>
  );
}
