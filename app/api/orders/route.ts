import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      location,
      notes,
      items,
      subtotal,
      paymentMethod,
      paymentStatus,
      mpesaCheckoutId,
    } = body;

    if (!customerName || !phone || !location || !items?.length) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        phone,
        location,
        notes: notes || null,
        items,
        subtotal,
        payment_method: paymentMethod,
        payment_status: paymentStatus || "unpaid",
        mpesa_checkout_id: mpesaCheckoutId || null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
