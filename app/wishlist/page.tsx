"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold">
          Your wishlist {items.length > 0 && `(${items.length})`}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-base-border bg-base-surface py-16 text-center">
            <Heart size={32} className="text-ink-faint" />
            <p className="text-ink-muted">Nothing saved yet.</p>
            <Link
              href="/"
              className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
      <Footer />
    </main>
  );
}
