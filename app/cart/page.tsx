"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { lines, setQty, removeItem, subtotal, clear } = useCart();

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-display text-2xl font-bold">
          Your cart {lines.length > 0 && `(${lines.length})`}
        </h1>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-base-border bg-base-surface py-16 text-center">
            <ShoppingBag size={32} className="text-ink-faint" />
            <p className="text-ink-muted">Your cart is empty.</p>
            <Link
              href="/"
              className="rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg hover:bg-signal-amber"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              {lines.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-xl border border-base-border bg-base-surface p-3"
                >
                  <Link
                    href={`/product/${product.id}`}
                    className="h-20 w-20 shrink-0 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${product.id}`}
                        className="text-sm font-medium text-ink-primary hover:text-signal-orange"
                      >
                        {product.name}
                      </Link>
                      <p className="spec-strip mt-0.5 text-xs text-signal-mint">
                        {product.specs.join(" · ")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-base-border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(product.id, qty - 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink-primary"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">
                          {qty}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.id, qty + 1)}
                          className="flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink-primary"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-display text-sm font-bold">
                        KSh {(product.price * qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${product.name}`}
                    onClick={() => removeItem(product.id)}
                    className="self-start text-ink-faint hover:text-signal-orange"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={clear}
                className="text-xs text-ink-faint hover:text-signal-orange"
              >
                Clear cart
              </button>
            </div>

            <div className="h-fit rounded-xl border border-base-border bg-base-surface p-5">
              <h2 className="mb-4 font-display text-lg font-bold">Summary</h2>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-ink-muted">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-base-border pt-4 font-display text-base font-bold">
                <span>Total</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-full bg-signal-orange py-3 text-center text-sm font-semibold text-base-bg hover:bg-signal-amber"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
