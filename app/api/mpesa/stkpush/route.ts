import { NextRequest, NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, orderRef } = await req.json();

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "phone and amount are required" },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;
    const result = await initiateStkPush({
      phone,
      amount,
      accountReference: orderRef || "Thomex",
      transactionDesc: "Thomex order",
      callbackUrl: `${origin}/api/mpesa/callback`,
    });

    return NextResponse.json({
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      message: result.CustomerMessage,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "STK push failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
