"use client";

import Link from "next/link";
import { Heart, Star, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const badgeStyles: Record<string, string> = {
  Deal: "bg-signal-orange text-base-bg",
  New: "bg-signal-mint text-base-bg",
  "Best Seller": "bg-signal-amber text-base-bg",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const discount =
    product.oldPrice &&
    Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="group relative flex w-56 shrink-0 flex-col rounded-xl border border-base-border bg-base-surface p-3 transition hover:border-signal-orange/50 sm:w-full">
      {product.badge && (
        <span
          className={`absolute left-3 top-3 z-10 rounded px-2 py-0.5 text-[10px] font-bold ${badgeStyles[product.badge]}`}
        >
          {product.badge}
        </span>
      )}
      <button
        aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        onClick={() => toggle(product)}
        className={`absolute right-3 top-3 z-10 rounded-full bg-base-bg/70 p-1.5 transition hover:text-signal-orange ${
          wishlisted ? "text-signal-orange" : "text-ink-muted"
        }`}
      >
        <Heart size={14} className={wishlisted ? "fill-signal-orange" : ""} />
      </button>

      <Link href={`/product/${product.id}`} className="contents">
        <div
          className="mb-3 aspect-square w-full rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${product.image})` }}
        />

        <p className="spec-strip mb-1 text-[11px] text-signal-mint">
          {product.specs.join(" · ")}
        </p>
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-ink-primary">
          {product.name}
        </h3>

        <div className="mb-2 flex items-center gap-1 text-xs text-ink-faint">
          <Star size={12} className="fill-signal-amber text-signal-amber" />
          {product.rating} ({product.reviews})
        </div>
      </Link>

      <div className="mt-auto flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-base font-bold text-ink-primary">
            KSh {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-xs font-semibold text-signal-orange">
              -{discount}%
            </span>
          )}
        </div>
        <button
          aria-label={`Add ${product.name} to cart`}
          onClick={() => addItem(product, 1)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-orange text-base-bg transition hover:bg-signal-amber"
        >
          <Plus size={16} />
        </button>
      </div>
      {product.oldPrice && (
        <span className="mt-0.5 text-xs text-ink-faint line-through">
          KSh {product.oldPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}
