"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AdminPageHeader, AdminPanel, AdminButton } from "@/components/admin/AdminUI";

export default function AdminSettingsPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setWhatsapp(data.settings.whatsapp || "");
          setEmail(data.settings.email || "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save settings");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Settings" />

      <AdminPanel>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[#646970]">
            <Loader2 size={16} className="animate-spin" /> Loading settings…
          </div>
        ) : (
          <div className="max-w-lg space-y-5">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">
                WhatsApp number for orders
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="2547XXXXXXXX"
                className="w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
              />
              <p className="mt-1 text-[12px] text-[#646970]">
                International format, digits only — no + or spaces. Where pay-on-delivery
                orders get sent, and the number linked from the site's Contact and WhatsApp
                buttons.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1d2327]">
                Order / contact email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orders@yourstore.com"
                className="w-full rounded-[3px] border border-[#8c8f94] px-2.5 py-1.5 text-[13px] focus:border-[#2271b1] focus:outline-none focus:ring-1 focus:ring-[#2271b1]"
              />
              <p className="mt-1 text-[12px] text-[#646970]">
                Where "Send order via email" and the Contact page's email link point.
              </p>
            </div>

            {error && <p className="text-[13px] text-[#d63638]">{error}</p>}

            <div className="flex items-center gap-3 border-t border-[#f0f0f1] pt-4">
              <AdminButton onClick={save} disabled={saving}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save changes
              </AdminButton>
              {saved && (
                <span className="flex items-center gap-1.5 text-[13px] text-[#00a32a]">
                  <CheckCircle2 size={14} /> Saved
                </span>
              )}
            </div>
          </div>
        )}
      </AdminPanel>
    </div>
  );
}
