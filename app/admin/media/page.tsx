"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, Trash2, X } from "lucide-react";
import { AdminPageHeader, AdminPanel, AdminButton } from "@/components/admin/AdminUI";

type MediaFile = {
  name: string;
  url: string;
  size: number | null;
  createdAt: string;
};

type AdminProduct = { id: string; name: string; image: string };

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[] | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaFile | null>(null);

  const load = () => {
    fetch("/api/admin/media")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setFiles(data.files);
      });
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  };

  useEffect(load, []);

  const usedBy = (url: string) => products.find((p) => p.image === url);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (name: string) => {
    if (!confirm("Delete this photo? This can't be undone.")) return;
    setFiles((prev) => prev?.filter((f) => f.name !== name) ?? null);
    setSelected(null);
    const res = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        action={
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-[3px] border border-[#2271b1] bg-[#2271b1] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#135e96]">
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
            Add New
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
        }
      />

      <AdminPanel>
        {error && <p className="mb-3 text-[13px] text-[#d63638]">{error}</p>}
        {!files ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[#646970]">
            <Loader2 size={16} className="animate-spin" /> Loading media…
          </div>
        ) : files.length === 0 ? (
          <p className="py-4 text-[13px] text-[#646970]">
            No photos uploaded yet — use "Add New" or upload one from a product's form.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {files.map((f) => {
              const product = usedBy(f.url);
              return (
                <button
                  key={f.name}
                  onClick={() => setSelected(f)}
                  className="group relative aspect-square overflow-hidden rounded-[3px] border border-[#c3c4c7] bg-[#f6f7f7]"
                >
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${f.url})` }}
                  />
                  {!product && (
                    <span className="absolute left-1 top-1 rounded bg-[#d63638] px-1.5 py-0.5 text-[10px] font-medium text-white">
                      Unused
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </AdminPanel>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md rounded-[4px] bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-medium text-[#1d2327]">{selected.name}</p>
              <button
                onClick={() => setSelected(null)}
                className="rounded p-1 text-[#646970] hover:bg-[#f0f0f1]"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="mb-3 aspect-square w-full rounded-[3px] border border-[#c3c4c7] bg-cover bg-center"
              style={{ backgroundImage: `url(${selected.url})` }}
            />
            <p className="mb-1 text-[12px] text-[#646970]">{formatSize(selected.size)}</p>
            <p className="mb-3 break-all text-[12px] text-[#2271b1]">{selected.url}</p>
            {usedBy(selected.url) ? (
              <p className="mb-3 text-[12px] text-[#00a32a]">
                In use by: {usedBy(selected.url)!.name}
              </p>
            ) : (
              <p className="mb-3 text-[12px] text-[#d63638]">
                Not used by any product — safe to delete.
              </p>
            )}
            <AdminButton
              variant="secondary"
              onClick={() => remove(selected.name)}
              className="border-[#d63638] text-[#d63638] hover:bg-[#fcf0f1]"
            >
              <Trash2 size={13} /> Delete permanently
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
