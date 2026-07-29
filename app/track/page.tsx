"use client";

import { useState } from "react";
import { Search, PackageSearch, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Order, OrderStatus } from "@/lib/orderTypes";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-signal-amber/15 text-signal-amber",
  confirmed: "bg-signal-mint/15 text-signal-mint",
  dispatched: "bg-signal-mint/15 text-signal-mint",
  delivered: "bg-base-surface2 text-ink-muted",
  cancelled: "bg-signal-orange/15 text-signal-orange",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  dispatched: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    setOrders(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 font-display text-2xl font-bold">Track your order</h1>
        <p className="mb-6 text-sm text-ink-muted">
          Enter the phone number you used at checkout to see your recent orders.
        </p>

        <div className="flex gap-3">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            type="tel"
            placeholder="07XX XXX XXX"
            className="flex-1 rounded-full border border-base-border bg-base-surface px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-signal-orange">{error}</p>}

        {orders && orders.length === 0 && (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-base-border bg-base-surface py-14 text-center">
            <PackageSearch size={26} className="text-ink-faint" />
            <p className="text-ink-muted">No orders found for that number.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-base-border bg-base-surface p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="spec-strip text-xs text-ink-faint">
                    #{order.id.slice(0, 8)} ·{" "}
                    {new Date(order.created_at).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <ul className="mb-2 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-sm text-ink-muted">
                      {item.name} x{item.qty}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-base-border pt-2 text-sm">
                  <span className="text-ink-faint">
                    {order.payment_method === "mpesa"
                      ? order.payment_status === "paid"
                        ? "Paid via M-Pesa"
                        : "M-Pesa — unpaid"
                      : "Pay on delivery"}
                  </span>
                  <span className="font-display font-bold">
                    KSh {order.subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
