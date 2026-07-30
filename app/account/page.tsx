"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  LogOut,
  PackageSearch,
  Mail,
  Heart,
  Clock,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductRail from "@/components/ProductRail";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { products } from "@/data/products";
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

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const recentlyViewedProducts = getRecentlyViewed()
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  useEffect(() => {
    if (!user) return;
    fetch("/api/orders/mine")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading) {
    return (
      <main>
        <Header />
        <div className="flex items-center justify-center py-24">
          <Loader2 size={22} className="animate-spin text-signal-orange" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">
            You&apos;re not signed in
          </h1>
          <p className="text-sm text-ink-muted">
            Sign in to see your account, orders, and wishlist.
          </p>
          <Link
            href="/signin"
            className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
          >
            Sign in
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const name = (user.user_metadata?.full_name as string) || null;

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Welcome header */}
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-orange/15 text-xl font-bold text-signal-orange">
            {(name || user.email || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">
              Welcome{name ? `, ${name}` : ""}!
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <Mail size={13} /> {user.email}
            </p>
          </div>
        </div>

        {/* Orders */}
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">My orders</h2>
          </div>

          {ordersLoading ? (
            <div className="flex items-center gap-2 py-6 text-sm text-ink-muted">
              <Loader2 size={16} className="animate-spin" /> Loading your orders…
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-base-border bg-base-surface p-4 text-sm text-ink-muted">
              <PackageSearch size={18} className="text-ink-faint" />
              No orders yet — they&apos;ll show up here once you check out.
            </div>
          ) : (
            <div className="space-y-3">
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
        </section>

        {/* Wishlist */}
        <section className="mb-8">
          <Link
            href="/wishlist"
            className="flex items-center justify-between rounded-xl border border-base-border bg-base-surface p-4 hover:border-signal-orange/50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-base-surface2 text-signal-orange">
                <Heart size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink-primary">Wishlist</p>
                <p className="text-xs text-ink-faint">
                  {wishlistItems.length > 0
                    ? `${wishlistItems.length} item${wishlistItems.length === 1 ? "" : "s"} saved`
                    : "Nothing saved yet"}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-ink-faint" />
          </Link>
        </section>

        {/* Recently viewed */}
        {recentlyViewedProducts.length > 0 && (
          <section className="mb-8 -mx-4 sm:mx-0">
            <div className="mb-3 flex items-center gap-2 px-4 sm:px-0">
              <Clock size={16} className="text-signal-orange" />
              <h2 className="font-display text-lg font-bold">Recently viewed</h2>
            </div>
            <ProductRail title="" items={recentlyViewedProducts} />
          </section>
        )}

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-base-border py-3 text-sm font-semibold text-ink-primary hover:bg-base-surface2"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
      <Footer />
    </main>
  );
}
