"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";

function useCountdown(hours: number) {
  const [remaining, setRemaining] = useState(hours * 3600);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m ${s
    .toString()
    .padStart(2, "0")}s`;
}

export default function FlashSales({ items }: { items: Product[] }) {
  const countdown = useCountdown(6);

  if (items.length === 0) return null;

  return (
    <section id="deals" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Flash sales</h2>
        <span className="spec-strip flex items-center gap-1.5 rounded-full border border-signal-orange/40 bg-signal-orange/10 px-3 py-1 text-xs text-signal-orange">
          <Timer size={13} /> {countdown} left
        </span>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
