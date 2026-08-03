"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return <AdminShell>{children}</AdminShell>;
}
