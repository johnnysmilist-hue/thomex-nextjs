"use client";

import { useState } from "react";
import { MessageCircle, Mail, MapPin, Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSettings } from "@/context/SettingsContext";

const values = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    body: "Wherever you are, we get it to your door — fast.",
  },
  {
    icon: ShieldCheck,
    title: "Picked by the spec",
    body: "We check battery, storage, and build before anything goes on the shelf.",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    body: "Not the right fit? Send it back within a week, no hassle.",
  },
  {
    icon: Headset,
    title: "Real support",
    body: "A person on WhatsApp, not a chatbot loop.",
  },
];

export default function AboutPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const canSend = name.trim() && message.trim();

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hi Thomex, I'm ${name || "..."}.\n\n${message}`
  )}`;
  const mailLink = `mailto:${settings.email}?subject=${encodeURIComponent(
    "Message from Thomex website"
  )}&body=${encodeURIComponent(`From: ${name || "..."}\n\n${message}`)}`;

  return (
    <main>
      <Header />

      <section className="border-b border-base-border bg-circuit-fade">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mb-3 inline-block rounded-full border border-signal-orange/40 bg-signal-orange/10 px-3 py-1 text-xs font-medium text-signal-orange">
            About Thomex
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Tech, picked by the spec — not the hype.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-ink-muted">
            Thomex started as a simple idea: buying electronics online in
            Kenya shouldn&apos;t mean guessing whether a &quot;great deal&quot; is actually
            a good phone. We check the numbers that matter, price fairly, and
            stand behind what we sell.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl border border-base-border bg-base-surface p-5"
            >
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-base-surface2 text-signal-orange">
                <Icon size={18} />
              </span>
              <h3 className="mb-1 font-display font-semibold">{title}</h3>
              <p className="text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-base-border bg-base-surface/40">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="mb-2 font-display text-2xl font-bold">Get in touch</h2>
          <p className="mb-8 text-sm text-ink-muted">
            Questions about an order, a product, or bulk pricing — reach us
            directly.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-base-border bg-base-surface p-4 hover:border-signal-mint/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-mint/15 text-signal-mint">
                  <MessageCircle size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-primary">WhatsApp</p>
                  <p className="text-xs text-ink-faint">Fastest way to reach us</p>
                </div>
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 rounded-xl border border-base-border bg-base-surface p-4 hover:border-signal-orange/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-signal-orange/15 text-signal-orange">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Email</p>
                  <p className="text-xs text-ink-faint">{settings.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-xl border border-base-border bg-base-surface p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-base-surface2 text-ink-muted">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink-primary">Delivering nationwide</p>
                  <p className="text-xs text-ink-faint">Based in Kenya</p>
                </div>
              </div>
            </div>

            <form
              className="space-y-3 rounded-xl border border-base-border bg-base-surface p-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <label className="mb-1 block text-sm text-ink-muted">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border border-base-border bg-base-surface2 px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                  placeholder="Jane Wanjiru"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink-muted">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-base-border bg-base-surface2 px-4 py-2.5 text-sm focus:border-signal-orange focus:outline-none"
                  placeholder="Ask us anything…"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={canSend ? waLink : undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!canSend}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-signal-mint py-3 text-sm font-semibold text-base-bg transition hover:brightness-95 ${
                    !canSend ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <MessageCircle size={16} /> Send via WhatsApp
                </a>
                <a
                  href={canSend ? mailLink : undefined}
                  aria-disabled={!canSend}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-full border border-base-border py-3 text-sm font-semibold text-ink-primary transition hover:bg-base-surface2 ${
                    !canSend ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <Mail size={16} /> Send via email
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
