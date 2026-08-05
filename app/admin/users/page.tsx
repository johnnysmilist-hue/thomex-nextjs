"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminPageHeader, AdminPanel } from "@/components/admin/AdminUI";

type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  orderCount: number;
};

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setUsers(data.users);
      });
  }, []);

  return (
    <div>
      <AdminPageHeader title="Users" />

      <AdminPanel>
        {error && <p className="mb-3 text-[13px] text-[#d63638]">{error}</p>}
        {!users && !error ? (
          <div className="flex items-center gap-2 py-8 text-[13px] text-[#646970]">
            <Loader2 size={16} className="animate-spin" /> Loading users…
          </div>
        ) : users && users.length === 0 ? (
          <p className="py-4 text-[13px] text-[#646970]">No one has signed up yet.</p>
        ) : (
          users && (
            <div className="-mx-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#646970]">
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 font-medium">Joined</th>
                    <th className="px-4 py-2.5 font-medium">Last sign-in</th>
                    <th className="px-4 py-2.5 font-medium">Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-b border-[#f0f0f1] hover:bg-[#f6f7f7] ${i % 2 === 1 ? "bg-[#fbfbfc]" : ""}`}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-[#1d2327]">{u.email}</div>
                        {u.name && <div className="text-[12px] text-[#646970]">{u.name}</div>}
                      </td>
                      <td className="px-4 py-2.5 text-[#646970]">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-2.5 text-[#646970]">{formatDate(u.lastSignInAt)}</td>
                      <td className="px-4 py-2.5">
                        {u.orderCount > 0 ? (
                          <span className="rounded-full bg-[#f0f6fc] px-2 py-0.5 text-[12px] font-medium text-[#2271b1]">
                            {u.orderCount}
                          </span>
                        ) : (
                          <span className="text-[#8c8f94]">0</span>
                        )}
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
  );
}
