import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

// Uses the cookie-aware client (anon key + the visitor's session), not the
// service role key — so this can only ever return orders that belong to
// whoever is actually signed in. That's enforced by the "Users can view own
// orders" policy in supabase/schema.sql, not by application code.
export async function GET() {
  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer_name, phone, location, items, subtotal, payment_method, payment_status, status"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}
