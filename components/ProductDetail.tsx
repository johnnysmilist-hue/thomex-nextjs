"use client";

import { useState } from "react";
import { Star, Minus, Plus, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const discount =
    product.oldPrice &&
    Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div
        className="aspect-square w-full rounded-xl border border-base-border bg-cover bg-center"
        style={{ backgroundImage: `url(${product.image})` }}
      />

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-wide text-ink-faint">
          {product.category}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
          {product.name}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
          <span className="flex items-center gap-1">
            <Star size={14} className="fill-signal-amber text-signal-amber" />
            {product.rating}
          </span>
          <span className="text-ink-faint">
            ({product.reviews} verified ratings)
          </span>
        </div>

        <p className="spec-strip mt-4 text-sm text-signal-mint">
          {product.specs.join(" · ")}
        </p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-3xl font-bold text-ink-primary">
            KSh {product.price.toLocaleString()}
          </span>
          {product.oldPrice && (
            <>
              <span className="text-base text-ink-faint line-through">
                KSh {product.oldPrice.toLocaleString()}
              </span>
              <span className="rounded bg-signal-orange/15 px-2 py-0.5 text-sm font-semibold text-signal-orange">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border border-base-border">
            <button
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink-primary"
            >
              <Minus size={15} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center text-ink-muted hover:text-ink-primary"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-signal-orange py-3 text-sm font-semibold text-base-bg transition hover:bg-signal-amber"
          >
            <ShoppingCart size={16} />
            {added ? "Added to cart" : "Add to cart"}
          </button>
        </div>

        <div className="mt-6 space-y-3 rounded-xl border border-base-border bg-base-surface p-4">
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <Truck size={16} className="text-signal-orange" />
            Nationwide delivery, dispatched within 24 hours
          </div>
          <div className="flex items-center gap-3 text-sm text-ink-muted">
            <ShieldCheck size={16} className="text-signal-orange" />
            7-day returns, 1-year warranty on select items
          </div>
        </div>
      </div>
    </div>
  );
}
