import { NextRequest, NextResponse } from "next/server";
import { queryStkPushStatus } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const { checkoutRequestId } = await req.json();
    if (!checkoutRequestId) {
      return NextResponse.json(
        { error: "checkoutRequestId is required" },
        { status: 400 }
      );
    }

    const data = await queryStkPushStatus(checkoutRequestId);

    // ResultCode "0" = paid. Safaricom returns a 500-ish error body while the
    // customer hasn't responded on their phone yet — treat that as "pending".
    if (data.errorCode) {
      return NextResponse.json({ status: "pending" });
    }
    if (data.ResultCode === "0") {
      return NextResponse.json({ status: "paid" });
    }
    if (data.ResultCode !== undefined) {
      return NextResponse.json({
        status: "failed",
        reason: data.ResultDesc,
      });
    }
    return NextResponse.json({ status: "pending" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
