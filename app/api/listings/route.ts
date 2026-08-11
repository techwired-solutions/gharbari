import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { newListingSchema, MIN_FILL_TIME_MS } from "@/lib/validation";
import { isRateLimited, requestKeyFromHeaders } from "@/lib/rate-limit";
import { appendListingToSheet, syncToSheetSafely } from "@/lib/google-sheets";
import type { Listing } from "@/lib/types";

export async function GET() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
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

  const { data, error } = await supabase
    .from("listings")
    .insert({ ...fields, area: fields.area || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not save listing" }, { status: 500 });
  }

  // Best-effort mirror to Google Sheets — never blocks or fails the
  // response if the Sheet is unreachable or unconfigured.
  await syncToSheetSafely(() => appendListingToSheet(data as Listing), "public-create");

  return NextResponse.json({ listing: data }, { status: 201 });
}
