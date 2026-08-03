"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";
import { STATUS_BADGE_COLORS } from "@/lib/adminStatusColors";
import type { Order, OrderStatus } from "@/lib/orderTypes";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrders(data.orders);
      });
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) load();
  };

  return (
    <div>
      <AdminPageHeader title="Orders" />

      <AdminPanel>
        {error && <p className="text-sm text-[#d63638]">{error}</p>}
        {!orders && !error ? (
          <div className="flex items-center gap-2 py-8 text-sm text-[#646970]">
            <Loader2 size={16} className="animate-spin" /> Loading orders…
          </div>
        ) : orders && orders.length === 0 ? (
          <p className="py-4 text-sm text-[#646970]">No orders yet.</p>
        ) : (
          orders && (
            <div className="-mx-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#646970]">
                    <th className="px-4 py-2.5 font-medium">Order</th>
                    <th className="px-4 py-2.5 font-medium">Customer</th>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Total</th>
                    <th className="px-4 py-2.5 font-medium">Payment</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <>
                      <tr
                        key={o.id}
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className={`cursor-pointer border-b border-[#f0f0f1] hover:bg-[#f6f7f7] ${i % 2 === 1 ? "bg-[#fbfbfc]" : ""}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-[12px] text-[#2271b1]">
                          #{o.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-2.5">
                          <div>{o.customer_name}</div>
                          <div className="text-[12px] text-[#646970]">{o.phone}</div>
                        </td>
                        <td className="px-4 py-2.5 text-[#646970]">
                          {new Date(o.created_at).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                          })}
                        </td>
                        <td className="px-4 py-2.5 font-medium">
                          KSh {o.subtotal.toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5 text-[#646970]">
                          {o.payment_method === "mpesa"
                            ? o.payment_status === "paid"
                              ? "M-Pesa (paid)"
                              : "M-Pesa (unpaid)"
                            : "On delivery"}
                        </td>
                        <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={o.status}
                            onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                            className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-medium capitalize focus:outline-none focus:ring-1 focus:ring-[#2271b1] ${STATUS_BADGE_COLORS[o.status]}`}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s} className="bg-white text-[#1d2327]">
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {expanded === o.id && (
                        <tr className="border-b border-[#f0f0f1] bg-[#f6f7f7]">
                          <td colSpan={6} className="px-4 py-3">
                            <p className="mb-1 text-[12px] font-medium text-[#646970]">
                              Delivery: {o.location}
                            </p>
                            <ul className="list-inside list-disc text-[13px] text-[#1d2327]">
                              {o.items.map((item, idx) => (
                                <li key={idx}>
                                  {item.name} × {item.qty} — KSh{" "}
                                  {(item.price * item.qty).toLocaleString()}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </AdminPanel>
    </div>
  );
}
