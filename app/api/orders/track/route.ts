import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeKenyanPhone } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const normalized = normalizeKenyanPhone(phone);

    // Match either the normalized form or however it was originally typed,
    // since older orders might be stored in a slightly different format.
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, created_at, customer_name, phone, location, items, subtotal, payment_method, payment_status, status"
      )
      .or(`phone.eq.${normalized},phone.eq.${phone}`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ orders: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
