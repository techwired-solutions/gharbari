import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { newListingSchema, MIN_FILL_TIME_MS } from "@/lib/validation";
import { isRateLimited, requestKeyFromHeaders } from "@/lib/rate-limit";
import { appendListingToSheet, syncToSheetSafely } from "@/lib/google-sheets";
import { PUBLIC_LISTING_COLUMNS, toPublicListing, type Listing } from "@/lib/types";

export async function GET() {
  // Anon-key client + an explicit public column list: contact_name/number
  // are excluded here in the app layer, and unreadable by the anon role at
  // all at the database level (migration_003_public_contact_privacy.sql).
  const { data, error } = await supabase
    .from("listings")
    .select(PUBLIC_LISTING_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: "Could not load listings" }, { status: 500 });
  }
  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(req: NextRequest) {
  const key = requestKeyFromHeaders(req.headers);
  if (isRateLimited(`create:${key}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = newListingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { website, formOpenedAt, ...fields } = parsed.data;

  // Honeypot tripped, or the form was submitted implausibly fast — quietly
  // reject without telling a bot why.
  if (website || (formOpenedAt && Date.now() - formOpenedAt < MIN_FILL_TIME_MS)) {
    return NextResponse.json({ error: "Submission rejected" }, { status: 400 });
  }

  // Uses the service-role client for the write itself (this still runs
  // entirely server-side, gated by the honeypot/rate-limit/zod checks
  // above — nothing here is reachable directly from the browser). That's
  // what lets this handler get the full row back — including
  // contact_name/contact_number — to sync to Google Sheets, while the
  // response sent to the browser below has those two fields stripped: the
  // anon key can't read them, and neither should the submitter's own
  // fetch response, since that response could end up rendered.
  const { data, error } = await supabaseAdmin()
    .from("listings")
    .insert({ ...fields, area: fields.area || null, map_link: fields.map_link || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save listing" }, { status: 500 });
  }

  // Best-effort mirror to Google Sheets — never blocks or fails the
  // response if the Sheet is unreachable or unconfigured.
  await syncToSheetSafely(() => appendListingToSheet(data as Listing), "public-create");

  return NextResponse.json({ listing: toPublicListing(data as Listing) }, { status: 201 });
}
