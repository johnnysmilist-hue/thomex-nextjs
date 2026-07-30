"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client-side only. Uses the anon (public) key — safe to expose in the
// browser, unlike the service role key used in app/api/* route handlers.
export function getSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
