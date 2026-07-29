"use client";

import { Search, Heart, ShoppingCart, User, Zap, Menu } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useMobileMenu } from "@/context/MobileMenuContext";

export default function Header() {
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const { toggle } = useMobileMenu();

  return (
    <header className="sticky top-0 z-50 border-b border-base-border bg-base-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <button
          aria-label="Open menu"
          onClick={toggle}
          className="rounded-full p-2 text-ink-muted hover:bg-base-surface hover:text-ink-primary md:hidden"
        >
          <Menu size={20} />
        </button>

        <a href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-orange text-base-bg">
            <Zap size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Thomex
          </span>
        </a>

        <div className="hidden flex-1 md:block">
          <label className="relative flex items-center">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 text-ink-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search phones, laptops, audio…"
              className="w-full rounded-full border border-base-border bg-base-surface py-2.5 pl-10 pr-4 text-sm text-ink-primary placeholder:text-ink-faint focus:border-signal-orange focus:outline-none"
            />
          </label>
        </div>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-ink-muted hover:bg-base-surface hover:text-ink-primary md:block"
          >
            <Heart size={19} />
          </button>
          <a
            href="/track"
            aria-label="Track your order"
            className="hidden rounded-full p-2 text-ink-muted hover:bg-base-surface hover:text-ink-primary md:block"
          >
            <User size={19} />
          </a>
          <a
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-ink-muted hover:bg-base-surface hover:text-ink-primary"
          >
            <ShoppingCart size={19} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-signal-orange text-[10px] font-semibold text-base-bg">
                {itemCount}
              </span>
            )}
          </a>
        </nav>
      </div>

      <div className="border-t border-base-border/60 px-4 sm:hidden">
        <label className="relative flex items-center py-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 text-ink-faint"
          />
          <input
            type="text"
            placeholder="Search Thomex…"
            className="w-full rounded-full border border-base-border bg-base-surface py-2 pl-9 pr-4 text-sm placeholder:text-ink-faint focus:border-signal-orange focus:outline-none"
          />
        </label>
      </div>

      <div className="hidden border-t border-base-border/60 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 px-6 py-2 text-sm text-ink-muted">
          {[
            { label: "Phones", href: "/category/phones" },
            { label: "Laptops", href: "/category/laptops" },
            { label: "Audio", href: "/category/audio" },
            { label: "Wearables", href: "/category/wearables" },
            { label: "Gaming", href: "/category/gaming" },
            { label: "Deals", href: "/#deals" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                item.label === "Deals"
                  ? "font-medium text-signal-orange hover:text-signal-amber"
                  : "hover:text-ink-primary"
              }
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
