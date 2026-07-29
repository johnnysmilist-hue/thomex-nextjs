import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service role key, which bypasses Row Level Security —
// never import this from a client component, and never expose this key to
// the browser. It's only read inside app/api/* route handlers, which run on
// the server.
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
