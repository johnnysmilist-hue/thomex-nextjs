import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { isAdminEmail } from "@/lib/isAdmin";

// Returns the verified admin user, or a 401/403 NextResponse to return
// immediately from the calling route. Verification happens server-side via
// the visitor's session cookie — never trust an email or role sent in the
// request body, since that could be spoofed by anyone calling the API.
export async function requireAdmin() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  if (!isAdminEmail(user.email)) {
    return { error: NextResponse.json({ error: "Not authorized" }, { status: 403 }) };
  }
  return { user };
}
