import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { newListingSchema } from "@/lib/validation";
import { appendListingToSheet, syncToSheetSafely } from "@/lib/google-sheets";
import type { Listing } from "@/lib/types";

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ listings: data ?? [] });
}

export async function POST(req: NextRequest) {
  const parsed = newListingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  // Admin-created listings skip the honeypot/fill-time bot checks — those
  // only apply to the public submission form — so only the real columns
  // are picked out here.
  const { data, error } = await supabaseAdmin()
    .from("listings")
    .insert({
      listing_type: parsed.data.listing_type,
      property_type: parsed.data.property_type,
      location: parsed.data.location,
      map_link: parsed.data.map_link || null,
      price_range: parsed.data.price_range,
      price_negotiable: parsed.data.price_negotiable,
      bedrooms: parsed.data.bedrooms,
      area: parsed.data.area || null,
      description: parsed.data.description,
      contact_name: parsed.data.contact_name,
      contact_number: parsed.data.contact_number,
      image_urls: parsed.data.image_urls,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await syncToSheetSafely(() => appendListingToSheet(data as Listing), "admin-create");

  return NextResponse.json({ listing: data }, { status: 201 });
}
