"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Mail, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ORDER_WHATSAPP_NUMBER, ORDER_EMAIL } from "@/data/config";
import {
  formatOrderMessage,
  buildWhatsAppLink,
  buildMailtoLink,
} from "@/lib/formatOrder";

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState<"whatsapp" | "email" | null>(null);

  const canSubmit = name.trim() && phone.trim() && location.trim() && lines.length > 0;

  const message = formatOrderMessage(
    { name, phone, location, notes },
    lines,
    subtotal
  );

  const handleSend = (channel: "whatsapp" | "email") => {
    if (!canSubmit) return;
    const url =
      channel === "whatsapp"
        ? buildWhatsAppLink(ORDER_WHATSAPP_NUMBER, message)
        : buildMailtoLink(ORDER_EMAIL, message);
    window.open(url, "_blank");
    setSent(channel);
    clear();
  };

  if (lines.length === 0 && !sent) {
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

  if (sent) {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-mint/15 text-signal-mint">
            <ShoppingBag size={24} />
          </span>
          <h1 className="font-display text-2xl font-bold">
            Order details ready to send
          </h1>
          <p className="max-w-md text-sm text-ink-muted">
            {sent === "whatsapp"
              ? "We opened WhatsApp with your order pre-filled — just hit send there to reach Thomex. We'll confirm and arrange delivery, payment on drop-off."
              : "We opened your email app with the order pre-filled — just hit send. We'll confirm and arrange delivery, payment on drop-off."}
          </p>
          <Link
            href="/"
            className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
          >
            Back to shopping
          </Link>
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
              <label className="mb-1 block text-sm text-ink-muted">
                Full name
              </label>
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
              <label className="mb-1 block text-sm text-ink-muted">
                Phone number
              </label>
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
              <label className="mb-1 block text-sm text-ink-muted">
                Delivery location
              </label>
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
              <label className="mb-1 block text-sm text-ink-muted">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="Preferred delivery time, landmark, etc."
              />
            </div>

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
          </form>

          <div className="h-fit rounded-xl border border-base-border bg-base-surface p-5">
            <h2 className="mb-4 font-display text-lg font-bold">
              Order summary
            </h2>
            <ul className="space-y-2">
              {lines.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex justify-between text-sm text-ink-muted"
                >
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
