"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, Loader2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <main>
        <Header />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-mint/15 text-signal-mint">
            <CheckCircle2 size={24} />
          </span>
          <h1 className="font-display text-2xl font-bold">Check your email</h1>
          <p className="text-sm text-ink-muted">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then sign in.
          </p>
          <Link
            href="/signin"
            className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
          >
            Go to sign in
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
        <h1 className="mb-1 font-display text-2xl font-bold">Create an account</h1>
        <p className="mb-8 text-sm text-ink-muted">
          Faster checkout and order tracking.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Full name</label>
            <div className="relative">
              <UserIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                className="w-full rounded-lg border border-base-border bg-base-surface py-2.5 pl-9 pr-4 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="Jane Wanjiru"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Email</label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="w-full rounded-lg border border-base-border bg-base-surface py-2.5 pl-9 pr-4 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-muted">Password</label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                className="w-full rounded-lg border border-base-border bg-base-surface py-2.5 pl-9 pr-4 text-sm focus:border-signal-orange focus:outline-none"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          {error && <p className="text-sm text-signal-orange">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-signal-orange py-3 text-sm font-semibold text-base-bg transition hover:bg-signal-amber disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-signal-orange hover:text-signal-amber">
            Sign in
          </Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}
