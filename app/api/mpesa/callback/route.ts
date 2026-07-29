import { NextRequest, NextResponse } from "next/server";

// Safaricom calls this URL once a payment finishes (success or fail). We don't
// have a database yet, so this just logs the result — the checkout page's own
// polling of /api/mpesa/status is what actually confirms payment to the
// customer right now. Once you add a database, this is the right place to
// mark the matching order as paid (match on CheckoutRequestID).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  console.log("M-Pesa callback received:", JSON.stringify(body));

  // Safaricom requires a fast 200 response acknowledging receipt.
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
