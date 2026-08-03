"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ShoppingBag, Package, Clock } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";
import { STATUS_BADGE_COLORS } from "@/lib/adminStatusColors";
import type { Order } from "@/lib/orderTypes";

type AdminProduct = { id: string };

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []));
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProductCount((data.products as AdminProduct[])?.length ?? 0));
  }, []);

  const pendingCount = orders?.filter((o) => o.status === "pending").length ?? 0;

  return (
    <div>
      <AdminPageHeader title="Dashboard" />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminPanel>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0f6fc] text-[#2271b1]">
              <ShoppingBag size={18} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none">
                {orders === null ? <Loader2 size={16} className="animate-spin" /> : orders.length}
              </p>
              <Link href="/admin/orders" className="text-[13px] text-[#2271b1] hover:underline">
                Orders
              </Link>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fcf0e8] text-[#f0b849]">
              <Clock size={18} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none">
                {orders === null ? <Loader2 size={16} className="animate-spin" /> : pendingCount}
              </p>
              <span className="text-[13px] text-[#646970]">Pending orders</span>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ed] text-[#00a32a]">
              <Package size={18} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none">
                {productCount === null ? <Loader2 size={16} className="animate-spin" /> : productCount}
              </p>
              <Link href="/admin/products" className="text-[13px] text-[#2271b1] hover:underline">
                Products
              </Link>
            </div>
          </div>
        </AdminPanel>
      </div>

      <AdminPanel>
        <h2 className="mb-3 text-sm font-semibold text-[#1d2327]">Recent orders</h2>
        {orders === null ? (
          <div className="flex items-center gap-2 py-6 text-sm text-[#646970]">
            <Loader2 size={15} className="animate-spin" /> Loading…
          </div>
        ) : orders.length === 0 ? (
          <p className="py-4 text-sm text-[#646970]">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#c3c4c7] text-[#646970]">
                <th className="py-2 pr-3 font-medium">Customer</th>
                <th className="py-2 pr-3 font-medium">Total</th>
                <th className="py-2 pr-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b border-[#f0f0f1] last:border-0">
                  <td className="py-2 pr-3">{o.customer_name}</td>
                  <td className="py-2 pr-3">KSh {o.subtotal.toLocaleString()}</td>
                  <td className="py-2 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_BADGE_COLORS[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {orders && orders.length > 0 && (
          <Link
            href="/admin/orders"
            className="mt-3 inline-block text-[13px] text-[#2271b1] hover:underline"
          >
            View all orders →
          </Link>
        )}
      </AdminPanel>
    </div>
  );
}
