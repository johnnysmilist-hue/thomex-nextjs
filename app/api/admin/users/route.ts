import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = getSupabaseAdmin();

  const { data: userData, error: userError } = await supabase.auth.admin.listUsers({
    perPage: 200,
  });
  if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });

  const { data: orderRows } = await supabase.from("orders").select("user_id").not("user_id", "is", null);

  const orderCounts = new Map<string, number>();
  for (const row of orderRows || []) {
    if (!row.user_id) continue;
    orderCounts.set(row.user_id, (orderCounts.get(row.user_id) || 0) + 1);
  }

  const users = userData.users
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: (u.user_metadata?.full_name as string) || null,
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at || null,
      orderCount: orderCounts.get(u.id) || 0,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ users });
}
