"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartLine = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "thomex_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // load from localStorage once, client-side only
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // persist on every change, after initial hydration
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem: CartContextValue["addItem"] = (product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const removeItem = (id: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== id));
  };

  const setQty = (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);
    setLines((prev) =>
      prev.map((l) => (l.product.id === id ? { ...l, qty } : l))
    );
  };

  const clear = () => setLines([]);

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce(
    (sum, l) => sum + l.qty * l.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{ lines, addItem, removeItem, setQty, clear, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
