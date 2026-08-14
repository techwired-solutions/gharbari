import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { newListingSchema } from "@/lib/validation";
import { deleteListingFromSheet, syncToSheetSafely, updateListingInSheet } from "@/lib/google-sheets";
import type { Listing } from "@/lib/types";

const updateSchema = newListingSchema
  .omit({ website: true, formOpenedAt: true })
  .partial();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { ...parsed.data };
  if ("area" in updates) updates.area = updates.area || null;
  if ("map_link" in updates) updates.map_link = updates.map_link || null;

  const { data, error } = await supabaseAdmin()
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await syncToSheetSafely(() => updateListingInSheet(data as Listing), "admin-update");

  return NextResponse.json({ listing: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Invalid listing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("listings").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await syncToSheetSafely(() => deleteListingFromSheet(id), "admin-delete");

  return NextResponse.json({ ok: true });
}
