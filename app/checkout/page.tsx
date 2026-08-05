"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, ShoppingBag, Smartphone, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import {
  formatOrderMessage,
  buildWhatsAppLink,
  buildMailtoLink,
} from "@/lib/formatOrder";

type PaymentMethod = "delivery" | "mpesa";
type MpesaState = "idle" | "sending" | "waiting" | "paid" | "failed" | "error";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");

  const [method, setMethod] = useState<PaymentMethod>("delivery");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [mpesaState, setMpesaState] = useState<MpesaState>("idle");
  const [mpesaError, setMpesaError] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const canSubmit =
    name.trim() && phone.trim() && location.trim() && lines.length > 0;

  const buildMessage = (paymentNote: string) =>
    formatOrderMessage(
      { name, phone, location, notes: [notes, paymentNote].filter(Boolean).join(" | ") },
      lines,
      subtotal
    );

  // Saves the order to the database. Returns the new order's id, or null if
  // it failed (we still let checkout continue via WhatsApp/email either way
  // so a database hiccup never blocks a sale).
  const saveOrder = async (opts: {
    paymentMethod: PaymentMethod;
    paymentStatus: "unpaid" | "paid";
    mpesaCheckoutId?: string;
  }) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          location,
          notes,
          items: lines.map((l) => ({
            name: l.product.name,
            qty: l.qty,
            price: l.product.price,
          })),
          subtotal,
          paymentMethod: opts.paymentMethod,
          paymentStatus: opts.paymentStatus,
          mpesaCheckoutId: opts.mpesaCheckoutId,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save order");
      setOrderId(data.orderId);
      return data.orderId as string;
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save your order record"
      );
      return null;
    }
  };

  const recordOrder = (paymentNote: string) => {
    // Also fires the order to WhatsApp so it's easy to act on immediately,
    // on top of it being saved in the database.
    const url = buildWhatsAppLink(settings.whatsapp, buildMessage(paymentNote));
    window.open(url, "_blank");
  };

  const handleSend = async (channel: "whatsapp" | "email") => {
    if (!canSubmit) return;
    await saveOrder({ paymentMethod: "delivery", paymentStatus: "unpaid" });

    const message = buildMessage("Payment: cash or M-Pesa on delivery");
    const url =
      channel === "whatsapp"
        ? buildWhatsAppLink(settings.whatsapp, message)
        : buildMailtoLink(settings.email, message);
    window.open(url, "_blank");
    setSent(channel);
    clear();
  };

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };

  const handlePayWithMpesa = async () => {
    if (!canSubmit) return;
    setMpesaError("");
    setMpesaState("sending");

    try {
      const res = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mpesaPhone || phone,
          amount: subtotal,
          orderRef: name || "Thomex",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      setMpesaState("waiting");

      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts += 1;
        try {
          const statusRes = await fetch("/api/mpesa/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutRequestId: data.checkoutRequestId }),
          });
          const statusData = await statusRes.json();

          if (statusData.status === "paid") {
            stopPolling();
            setMpesaState("paid");
            await saveOrder({
              paymentMethod: "mpesa",
              paymentStatus: "paid",
              mpesaCheckoutId: data.checkoutRequestId,
            });
            recordOrder("Payment: Paid via M-Pesa (till)");
            clear();
          } else if (statusData.status === "failed") {
            stopPolling();
            setMpesaState("failed");
            setMpesaError(statusData.reason || "Payment was not completed.");
          } else if (attempts >= 20) {
            stopPolling();
            setMpesaState("failed");
            setMpesaError("Timed out waiting for confirmation. Try again.");
          }
        } catch {
          // transient network hiccup while polling — keep trying until attempts run out
        }
      }, 3000);
    } catch (err) {
      setMpesaState("error");
      setMpesaError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (lines.length === 0 && !sent && mpesaState !== "paid") {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <ShoppingBag size={32} className="text-ink-faint" />
          <p className="text-ink-muted">
            Your cart is empty — add something before checking out.
          </p>
          <Link
            href="/"
            className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
          >
            Continue shopping
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (sent || mpesaState === "paid") {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-mint/15 text-signal-mint">
            {mpesaState === "paid" ? <CheckCircle2 size={24} /> : <ShoppingBag size={24} />}
          </span>
          <h1 className="font-display text-2xl font-bold">
            {mpesaState === "paid" ? "Payment received" : "Order details ready to send"}
          </h1>
          <p className="max-w-md text-sm text-ink-muted">
            {mpesaState === "paid"
              ? "Your M-Pesa payment went through. We've also sent your order details over so we can get it packed and out for delivery."
              : sent === "whatsapp"
              ? "We opened WhatsApp with your order pre-filled — just hit send there to reach Thomex. We'll confirm and arrange delivery, payment on drop-off."
              : "We opened your email app with the order pre-filled — just hit send. We'll confirm and arrange delivery, payment on drop-off."}
          </p>
          {orderId && (
            <p className="text-xs text-ink-faint">
              Order reference:{" "}
              <span className="spec-strip text-ink-muted">{orderId.slice(0, 8)}</span>
            </p>
          )}
          {saveError && (
            <p className="max-w-md text-xs text-signal-orange">
              Your order message was sent, but we couldn&apos;t save a tracking
              record ({saveError}) — the WhatsApp/email message is still your
              order confirmation.
            </p>
          )}
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
            >
              Back to shopping
            </Link>
            <Link
              href="/track"
              className="rounded-full border border-base-border px-5 py-2.5 text-sm font-semibold text-ink-primary hover:bg-base-surface2"
            >
              Track my order
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          <form
            className="space-y-4 md:col-span-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                className="w-full rounded-lg border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="Jane Wanjiru"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Phone number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                required
                className="w-full rounded-lg border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="07XX XXX XXX"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Delivery location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                required
                className="w-full rounded-lg border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="Estate, town / area"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink-muted">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="Preferred delivery time, landmark, etc."
              />
            </div>

            <div>
              <p className="mb-2 text-sm text-ink-muted">How do you want to pay?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod("delivery")}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    method === "delivery"
                      ? "border-signal-orange bg-signal-orange/10 text-ink-primary"
                      : "border-base-border text-ink-muted hover:border-base-border"
                  }`}
                >
                  <span className="block font-medium">Pay on delivery</span>
                  <span className="text-xs text-ink-faint">Cash or M-Pesa at your door</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("mpesa")}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                    method === "mpesa"
                      ? "border-signal-orange bg-signal-orange/10 text-ink-primary"
                      : "border-base-border text-ink-muted hover:border-base-border"
                  }`}
                >
                  <span className="block font-medium">Pay with M-Pesa now</span>
                  <span className="text-xs text-ink-faint">STK push to your phone</span>
                </button>
              </div>
            </div>

            {method === "delivery" && (
              <>
                <p className="text-xs text-ink-faint">
                  Payment: cash or M-Pesa on delivery — no payment is taken now.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => handleSend("whatsapp")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-signal-mint py-3 text-sm font-semibold text-base-bg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MessageCircle size={16} /> Send order via WhatsApp
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => handleSend("email")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-base-border py-3 text-sm font-semibold text-ink-primary transition hover:bg-base-surface2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Mail size={16} /> Send order via email
                  </button>
                </div>
              </>
            )}

            {method === "mpesa" && (
              <div className="space-y-3 rounded-xl border border-base-border bg-base-surface p-4">
                <div>
                  <label className="mb-1 block text-sm text-ink-muted">
                    M-Pesa number (leave blank to use the phone above)
                  </label>
                  <input
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    type="tel"
                    className="w-full rounded-lg border border-base-border bg-base-surface2 px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                    placeholder="07XX XXX XXX"
                  />
                </div>

                {mpesaState === "idle" && (
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={handlePayWithMpesa}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-signal-orange py-3 text-sm font-semibold text-base-bg transition hover:bg-signal-amber disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Smartphone size={16} /> Pay KSh {subtotal.toLocaleString()} with M-Pesa
                  </button>
                )}

                {(mpesaState === "sending" || mpesaState === "waiting") && (
                  <div className="flex items-center gap-3 rounded-lg bg-base-surface2 p-3 text-sm text-ink-muted">
                    <Loader2 size={16} className="animate-spin text-signal-orange" />
                    {mpesaState === "sending"
                      ? "Sending payment request…"
                      : "Check your phone and enter your M-Pesa PIN to complete payment…"}
                  </div>
                )}

                {(mpesaState === "failed" || mpesaState === "error") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-signal-orange/10 p-3 text-sm text-signal-orange">
                      <XCircle size={16} />
                      {mpesaError || "Payment could not be completed."}
                    </div>
                    <button
                      type="button"
                      onClick={() => setMpesaState("idle")}
                      className="text-xs text-ink-muted hover:text-ink-primary"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>

          <div className="h-fit rounded-xl border border-base-border bg-base-surface p-5">
            <h2 className="mb-4 font-display text-lg font-bold">Order summary</h2>
            <ul className="space-y-2">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between text-sm text-ink-muted">
                  <span className="line-clamp-1 pr-2">
                    {product.name} x{qty}
                  </span>
                  <span className="shrink-0 text-ink-primary">
                    KSh {(product.price * qty).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-base-border pt-4 font-display text-base font-bold">
              <span>Total</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
