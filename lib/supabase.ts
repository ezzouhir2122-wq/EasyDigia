import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  // Service role bypasses RLS ; anon works via the "insert" RLS policy on `leads`.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars manquantes");
  return createClient(url, key, { auth: { persistSession: false } });
}
