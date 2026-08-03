"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import { AdminPageHeader, AdminPanel, AdminButton } from "@/components/admin/AdminUI";

type AdminProduct = {
  id: string;
  created_at: string;
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

type FormState = {
  id: string;
  name: string;
  category: string;
  price: string;
  oldPrice: string;
  specs: string;
  rating: string;
  reviews: string;
  badge: string;
  image: string;
};

const emptyForm: FormState = {
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

const CATEGORIES = [
  "Phones",
  "Laptops",
  "Audio",
  "Wearables",
  "Cameras",
  "Gaming",
  "Smart Home",
  "Accessories",
  "Clearance",
];

const BADGES = ["", "New", "Deal", "Best Seller"];

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
      />
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const load = () => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setProducts(data.products);
      });
  };

  useEffect(load, []);

  const startCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setUploadError("");
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
    setUploadError("");
  };

  const cancel = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    setProducts((prev) => prev?.filter((p) => p.id !== id) ?? null);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) load();
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.name.trim() || !form.category || !form.price || !form.image) {
      setError("Name, category, price, and a photo are required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      id: editingId ? undefined : form.id || slugify(form.name),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      specs: form.specs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: form.rating ? Number(form.rating) : 0,
      reviews: form.reviews ? Number(form.reviews) : 0,
      badge: form.badge || null,
      image: form.image,
    };

    try {
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
      if (!res.ok) throw new Error(data.error || "Could not save product");

      cancel();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        action={
          !showForm && (
            <AdminButton onClick={startCreate}>
              <Plus size={14} /> Add New
            </AdminButton>
          )
        }
      />

      {showForm && (
        <AdminPanel>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#1d2327]">
              {editingId ? "Edit product" : "Add new product"}
            </h2>
            <button
              onClick={cancel}
              aria-label="Close"
              className="rounded p-1 text-[#646970] hover:bg-[#f0f0f1] hover:text-[#1d2327]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Product name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Nova X13 Smartphone, 256GB"
              className="sm:col-span-2"
            />

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">
                Badge (optional)
              </label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="Price (KSh)"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
              type="number"
              placeholder="42999"
            />
            <Field
              label="Sale price / old price (optional)"
              value={form.oldPrice}
              onChange={(v) => setForm({ ...form, oldPrice: v })}
              type="number"
              placeholder="54999"
            />

            <Field
              label="Specs (comma-separated)"
              value={form.specs}
              onChange={(v) => setForm({ ...form, specs: v })}
              placeholder="256GB, 5G, 108MP"
              className="sm:col-span-2"
            />

            <Field
              label="Rating (0–5, optional)"
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
              type="number"
              placeholder="4.6"
            />
            <Field
              label="Review count (optional)"
              value={form.reviews}
              onChange={(v) => setForm({ ...form, reviews: v })}
              type="number"
              placeholder="0"
            />

            <div className="sm:col-span-2">
              <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">Photo</label>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[3px] border border-[#c3c4c7] bg-[#f6f7f7]">
                  {form.image ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${form.image})` }}
                    />
                  ) : (
                    <ImageIcon size={18} className="text-[#8c8f94]" />
                  )}
                </div>

                <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-dashed border-[#8c8f94] py-3 text-[13px] text-[#646970] hover:border-[#2271b1] hover:text-[#1d2327]">
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Uploading…
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Upload photo
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {uploadError && (
                <p className="mt-1.5 text-[12px] text-[#d63638]">{uploadError}</p>
              )}
              <details className="mt-2">
                <summary className="cursor-pointer text-[12px] text-[#646970] hover:text-[#1d2327]">
                  Or paste an image link instead
                </summary>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://…"
                  className="mt-2 w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
                />
              </details>
            </div>
          </div>

          {error && <p className="mt-3 text-[13px] text-[#d63638]">{error}</p>}

          <div className="mt-4 flex items-center gap-2 border-t border-[#f0f0f1] pt-4">
            <AdminButton onClick={submit} disabled={saving || uploading}>
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingId ? "Update product" : "Publish product"}
            </AdminButton>
            <AdminButton variant="secondary" onClick={cancel}>
              Cancel
            </AdminButton>
          </div>
        </AdminPanel>
      )}

      <div className="mt-4">
        <AdminPanel>
          {!products && !error ? (
            <div className="flex items-center gap-2 py-8 text-[13px] text-[#646970]">
              <Loader2 size={16} className="animate-spin" /> Loading products…
            </div>
          ) : products && products.length === 0 ? (
            <p className="py-4 text-[13px] text-[#646970]">
              No products yet — click "Add New" to create your first one.
            </p>
          ) : (
            products && (
              <div className="-mx-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#646970]">
                      <th className="px-4 py-2.5 font-medium">Photo</th>
                      <th className="px-4 py-2.5 font-medium">Name</th>
                      <th className="px-4 py-2.5 font-medium">Category</th>
                      <th className="px-4 py-2.5 font-medium">Price</th>
                      <th className="px-4 py-2.5 font-medium">Rating</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`group border-b border-[#f0f0f1] hover:bg-[#f6f7f7] ${i % 2 === 1 ? "bg-[#fbfbfc]" : ""}`}
                      >
                        <td className="px-4 py-2.5">
                          <div
                            className="h-10 w-10 rounded-[3px] border border-[#c3c4c7] bg-cover bg-center"
                            style={{ backgroundImage: `url(${p.image})` }}
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-[#1d2327]">{p.name}</div>
                          {p.badge && (
                            <span className="text-[12px] text-[#646970]">{p.badge}</span>
                          )}
                          <div className="mt-0.5 flex gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => startEdit(p)}
                              className="flex items-center gap-1 text-[12px] text-[#2271b1] hover:underline"
                            >
                              <Pencil size={11} /> Edit
                            </button>
                            <button
                              onClick={() => remove(p.id)}
                              className="flex items-center gap-1 text-[12px] text-[#d63638] hover:underline"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[#646970]">{p.category}</td>
                        <td className="px-4 py-2.5">
                          <div className="font-medium text-[#1d2327]">
                            KSh {p.price.toLocaleString()}
                          </div>
                          {p.old_price && (
                            <div className="text-[12px] text-[#8c8f94] line-through">
                              KSh {p.old_price.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-[#646970]">
                          {p.rating > 0 ? `${p.rating} (${p.reviews})` : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => startEdit(p)}
                            className="rounded border border-[#8c8f94] px-2 py-1 text-[12px] text-[#2271b1] hover:bg-[#f0f0f1]"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
