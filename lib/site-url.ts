/**
 * Absolute site origin, used for share links, WhatsApp messages, and OG
 * metadata. NEXT_PUBLIC_ vars are inlined at build time and identical on
 * server and client, so using this (instead of `window.location.origin`)
 * avoids SSR/hydration mismatches and lets server-rendered <meta> tags use
 * the same value client-side code does.
 */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://gharbari-coral.vercel.app").replace(/\/$/, "");
}

export function getListingUrl(id: string): string {
  return `${getSiteUrl()}/listing/${id}`;
}
