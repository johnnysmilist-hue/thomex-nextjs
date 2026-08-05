import { createClient } from "@supabase/supabase-js";
import { ORDER_WHATSAPP_NUMBER, ORDER_EMAIL } from "@/data/config";

export type SiteSettings = {
  whatsapp: string;
  email: string;
};

const defaults: SiteSettings = {
  whatsapp: ORDER_WHATSAPP_NUMBER,
  email: ORDER_EMAIL,
};

// Public read — safe to call from the browser or a server component. Falls
// back to the hardcoded defaults in data/config.ts if Supabase isn't set up
// yet, or no row exists for a key, so the site never breaks while settings
// are being configured.
export async function getSettings(): Promise<SiteSettings> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return defaults;

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.from("settings").select("key, value");
    if (error || !data) return defaults;

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
    return {
      whatsapp: map.whatsapp || defaults.whatsapp,
      email: map.email || defaults.email,
    };
  } catch {
    return defaults;
  }
}
