import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill them in."
  );
}

/**
 * Anon-key client. Safe to use on the server (route handlers, server
 * components) — it is bound by the RLS policies in supabase/schema.sql,
 * which allow public select/insert on `listings` and nothing else.
 * Never import lib/supabase-admin from client components.
 */
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
});
