"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Store,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  House,
  Cable,
  Tag,
  PackageSearch,
  Info,
  Zap,
  User,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { useAuth } from "@/context/AuthContext";
import { sidebarCategories } from "@/data/categories";

const iconMap: Record<string, LucideIcon> = {
  store: Store,
  smartphone: Smartphone,
  laptop: Laptop,
  headphones: Headphones,
  watch: Watch,
  camera: Camera,
  "gamepad-2": Gamepad2,
  house: House,
  cable: Cable,
  tag: Tag,
};

export default function MobileMenu() {
  const { open, setOpen } = useMobileMenu();
  const { user } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-[70] w-[85%] max-w-xs overflow-y-auto bg-base-bg shadow-2xl transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-base-border px-4 py-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-orange text-base-bg">
              <Zap size={16} strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-bold">Thomex</span>
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-ink-muted hover:bg-base-surface hover:text-ink-primary"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Shop by category
          </p>
          <nav className="mb-6 overflow-hidden rounded-xl border border-base-border">
            {sidebarCategories.map((cat) => {
              const Icon = iconMap[cat.icon];
              return (
                <Link
                  key={cat.name}
                  href={cat.slug ? `/category/${cat.slug}` : "#"}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-base-border/60 bg-base-surface px-4 py-3 text-sm text-ink-muted last:border-0 hover:text-ink-primary"
                >
                  <Icon size={16} className="shrink-0 text-signal-orange" />
                  {cat.name}
                </Link>
              );
            })}
          </nav>

          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Quick links
          </p>
          <nav className="overflow-hidden rounded-xl border border-base-border">
            {[
              { label: "Flash deals", href: "/#deals", icon: Zap },
              { label: "Wishlist", href: "/wishlist", icon: Heart },
              { label: "Track my order", href: "/track", icon: PackageSearch },
              { label: "About & contact", href: "/about", icon: Info },
              user
                ? { label: "My account", href: "/account", icon: User }
                : { label: "Sign in / Create account", href: "/signin", icon: User },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-base-border/60 bg-base-surface px-4 py-3 text-sm text-ink-muted last:border-0 hover:text-ink-primary"
              >
                <Icon size={16} className="shrink-0 text-signal-orange" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
