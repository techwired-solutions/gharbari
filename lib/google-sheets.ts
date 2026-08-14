import "server-only";
import { SignJWT, importPKCS8 } from "jose";
import type { Listing } from "@/lib/types";

const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "Sheet1";
const HEADER_ROW = [
  "ID",
  "Created At",
  "Type",
  "Property Type",
  "Location",
  "Map Link",
  "Budget / Price",
  "Negotiable",
  "Bedrooms",
  "Area",
  "Description",
  "Contact Name",
  "Contact Number",
  "Photo URLs",
];

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEET_ID
  );
}

function listingToRow(listing: Listing): string[] {
  return [
    listing.id,
    listing.created_at,
    listing.listing_type,
    listing.property_type,
    listing.location,
    listing.map_link ?? "",
    listing.price_range,
    listing.price_negotiable ? "Yes" : "No",
    listing.bedrooms,
    listing.area ?? "",
    listing.description,
    listing.contact_name,
    listing.contact_number,
    (listing.image_urls ?? []).join(", "),
  ];
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  // Service account keys are usually pasted into env vars with literal
  // "\n" instead of real newlines — normalize either form.
  const pem = (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const key = await importPKCS8(pem, "RS256");

  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/spreadsheets" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(email)
    .setSubject(email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function sheetsFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getAccessToken();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`Google Sheets API error: ${res.status} ${await res.text()}`);
  }
  return res;
}

let headerEnsured = false;

async function ensureHeaderRow(): Promise<void> {
  if (headerEnsured) return;
  // Always (re)write the header rather than only writing when empty — cheap
  // and idempotent, and it self-heals the sheet if HEADER_ROW's columns
  // ever change shape (as happened when map_link/price_negotiable were
  // inserted mid-row) instead of leaving a stale header from before.
  await sheetsFetch(
    `/values/${encodeURIComponent(SHEET_NAME)}!A1:N1?valueInputOption=RAW`,
    { method: "PUT", body: JSON.stringify({ values: [HEADER_ROW] }) }
  );
  headerEnsured = true;
}

/** Row number (1-indexed, matching the sheet) of the listing with this id, or null. */
async function findRowById(id: string): Promise<number | null> {
  const res = await sheetsFetch(`/values/${encodeURIComponent(SHEET_NAME)}!A2:A`);
  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values ?? [];
  const index = rows.findIndex((row) => row[0] === id);
  return index === -1 ? null : index + 2; // +2: 1-indexed, plus the header row
}

let cachedSheetGid: number | null = null;

async function getSheetGid(): Promise<number> {
  if (cachedSheetGid !== null) return cachedSheetGid;
  const res = await sheetsFetch(`?fields=sheets.properties`);
  const data = (await res.json()) as {
    sheets: { properties: { sheetId: number; title: string } }[];
  };
  const match = data.sheets.find((s) => s.properties.title === SHEET_NAME) ?? data.sheets[0];
  cachedSheetGid = match.properties.sheetId;
  return cachedSheetGid;
}

/**
 * Mirrors a listing into the configured Google Sheet. Every function here is
 * best-effort: the Sheet is a convenience export, not the source of truth
 * (Supabase is), so callers should catch and log failures rather than fail
 * the request over a Sheets outage.
 */
export async function appendListingToSheet(listing: Listing): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;
  await ensureHeaderRow();
  await sheetsFetch(
    `/values/${encodeURIComponent(SHEET_NAME)}!A:N:append?valueInputOption=USER_ENTERED`,
    { method: "POST", body: JSON.stringify({ values: [listingToRow(listing)] }) }
  );
}

export async function updateListingInSheet(listing: Listing): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;
  const row = await findRowById(listing.id);
  if (row === null) {
    // Not in the sheet yet (e.g. it predates the integration) — add it.
    await appendListingToSheet(listing);
    return;
  }
  await sheetsFetch(
    `/values/${encodeURIComponent(SHEET_NAME)}!A${row}:N${row}?valueInputOption=USER_ENTERED`,
    { method: "PUT", body: JSON.stringify({ values: [listingToRow(listing)] }) }
  );
}

export async function deleteListingFromSheet(id: string): Promise<void> {
  if (!isGoogleSheetsConfigured()) return;
  const row = await findRowById(id);
  if (row === null) return;
  const sheetId = await getSheetGid();
  await sheetsFetch(`:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: row - 1,
              endIndex: row,
            },
          },
        },
      ],
    }),
  });
}

/** Fire-and-forget wrapper: logs on failure instead of throwing. */
export async function syncToSheetSafely(fn: () => Promise<void>, context: string): Promise<void> {
  try {
    await fn();
  } catch (error) {
    console.error(`[google-sheets] sync failed (${context}):`, (error as Error).message);
  }
}
