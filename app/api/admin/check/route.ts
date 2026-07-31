import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { isAdminEmail } from "@/lib/isAdmin";

export async function GET() {
  const supabase = getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.json({ isAdmin: isAdminEmail(user?.email) });
}
