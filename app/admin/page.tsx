"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2, Pencil, Plus, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import type { Order, OrderStatus } from "@/lib/orderTypes";

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  old_price: number | null;
  specs: string[];
  rating: number;
  reviews: number;
  badge: string | null;
  image: string;
};

const STATUSES: OrderStatus[] = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

const emptyForm = {
  id: "",
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  specs: "",
  rating: "",
  reviews: "",
  badge: "",
  image: "",
};

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      return;
    }
    fetch("/api/admin/check")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .finally(() => setChecking(false));
  }, [user, authLoading]);

  if (authLoading || checking) {
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
          <h1 className="font-display text-2xl font-bold">Admin sign-in required</h1>
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

  if (!isAdmin) {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold">Not authorized</h1>
          <p className="text-sm text-ink-muted">
            This account isn&apos;t on the admin list. Add your email to{" "}
            <code className="spec-strip">ADMIN_EMAILS</code> in Vercel if this is you.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold">Admin</h1>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab("orders")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === "orders"
                ? "bg-signal-orange text-base-bg"
                : "border border-base-border text-ink-muted hover:bg-base-surface2"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab("products")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === "products"
                ? "bg-signal-orange text-base-bg"
                : "border border-base-border text-ink-muted hover:bg-base-surface2"
            }`}
          >
            Products
          </button>
        </div>

        {tab === "orders" ? <OrdersTab /> : <ProductsTab />}
      </div>
      <Footer />
    </main>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

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
    if (!res.ok) load(); // revert to server truth if the update failed
  };

  if (error) return <p className="text-sm text-signal-orange">{error}</p>;
  if (!orders) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
        <Loader2 size={16} className="animate-spin" /> Loading orders…
      </div>
    );
  }
  if (orders.length === 0) {
    return <p className="text-sm text-ink-muted">No orders yet.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-base-border bg-base-surface p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-ink-primary">{order.customer_name}</p>
              <p className="text-xs text-ink-faint">
                {order.phone} · {order.location}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
              className="rounded-lg border border-base-border bg-base-surface2 px-3 py-1.5 text-xs font-medium capitalize focus:border-signal-orange focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <ul className="mb-2 space-y-0.5">
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
            <span className="font-display font-bold">KSh {order.subtotal.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  };

  useEffect(load, []);

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const startEdit = (p: AdminProduct) => {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      price: String(p.price),
      oldPrice: p.old_price ? String(p.old_price) : "",
      specs: p.specs.join(", "),
      rating: String(p.rating),
      reviews: String(p.reviews),
      badge: p.badge || "",
      image: p.image,
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  };

  const submit = async () => {
    setSaving(true);
    setError("");
    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: form.rating ? Number(form.rating) : 0,
      reviews: form.reviews ? Number(form.reviews) : 0,
      badge: form.badge || undefined,
      image: form.image.trim(),
    };

    const res = editingId
      ? await fetch(`/api/admin/products/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Could not save product");
      return;
    }
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-full bg-signal-orange px-4 py-2 text-sm font-semibold text-base-bg hover:bg-signal-amber"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-base-border bg-base-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-semibold">
              {editingId ? "Edit product" : "New product"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-ink-faint hover:text-ink-primary">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {!editingId && (
              <Field label="ID (unique, e.g. p7)" value={form.id} onChange={(v) => setForm({ ...form, id: v })} />
            )}
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            <Field label="Price (KSh)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
            <Field label="Old price (optional)" value={form.oldPrice} onChange={(v) => setForm({ ...form, oldPrice: v })} type="number" />
            <Field label="Rating (0–5)" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} type="number" />
            <Field label="Reviews count" value={form.reviews} onChange={(v) => setForm({ ...form, reviews: v })} type="number" />
            <div>
              <label className="mb-1 block text-xs text-ink-muted">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full rounded-lg border border-base-border bg-base-surface2 px-3 py-2 text-sm focus:border-signal-orange focus:outline-none"
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Deal">Deal</option>
                <option value="Best Seller">Best Seller</option>
              </select>
            </div>
            <Field
              label="Specs (comma-separated)"
              value={form.specs}
              onChange={(v) => setForm({ ...form, specs: v })}
              className="sm:col-span-2"
            />
            <Field
              label="Image URL"
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              className="sm:col-span-2"
            />
          </div>

          {error && <p className="mt-3 text-sm text-signal-orange">{error}</p>}

          <button
            onClick={submit}
            disabled={saving}
            className="mt-4 rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Create product"}
          </button>
        </div>
      )}

      {!products ? (
        <div className="flex items-center gap-2 py-8 text-sm text-ink-muted">
          <Loader2 size={16} className="animate-spin" /> Loading products…
        </div>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-base-border bg-base-surface p-3"
            >
              <div
                className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink-primary">{p.name}</p>
                <p className="text-xs text-ink-faint">
                  {p.category} · KSh {p.price.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => startEdit(p)}
                aria-label={`Edit ${p.name}`}
                className="rounded-full p-2 text-ink-muted hover:bg-base-surface2 hover:text-ink-primary"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => remove(p.id)}
                aria-label={`Delete ${p.name}`}
                className="rounded-full p-2 text-ink-muted hover:bg-base-surface2 hover:text-signal-orange"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs text-ink-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-base-border bg-base-surface2 px-3 py-2 text-sm focus:border-signal-orange focus:outline-none"
      />
    </div>
  );
}
