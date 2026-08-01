"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export default function ProductGrid({
  products,
  emptyMessage = "No products in this category yet — check back soon.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  const [sort, setSort] = useState<Sort>("featured");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, sort]);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-base-border bg-base-surface py-16 text-center text-ink-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-ink-muted">
          {products.length} product{products.length !== 1 ? "s" : ""}
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-base-border bg-base-surface px-3 py-1.5 text-sm text-ink-primary focus:border-signal-orange focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
