"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareButton({
  url,
  title,
  label,
  copiedLabel,
  iconOnly = false,
  className,
}: {
  url: string;
  title: string;
  label: string;
  copiedLabel: string;
  /** Renders just the icon (label kept for screen readers via aria-label). */
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the share sheet — not an error.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing more we can do silently.
    }
  }

  const defaultClassName = iconOnly
    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/45 transition hover:bg-sand-dim hover:text-ink"
    : "flex items-center justify-center gap-2 rounded-xl border border-line px-4 py-3 text-sm font-bold text-ink transition hover:bg-sand-dim";

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
      className={className ?? defaultClassName}
    >
      {copied ? <Check className="h-4 w-4 text-leaf" /> : <Share2 className="h-4 w-4" />}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
