import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, customer_name, phone, location, items, subtotal, payment_method, payment_status, status"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
