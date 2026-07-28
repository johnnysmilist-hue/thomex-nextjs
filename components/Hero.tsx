import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-base-border bg-circuit-fade">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="flex flex-col justify-center gap-5">
          <span className="w-fit rounded-full border border-signal-orange/40 bg-signal-orange/10 px-3 py-1 text-xs font-medium text-signal-orange">
            New drop · This week only
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Spec it.
            <br />
            <span className="text-signal-orange">Ship it.</span> Own it.
          </h1>
          <p className="max-w-md text-ink-muted">
            Thomex picks tech by the numbers that matter — battery, storage,
            and build — then prices it fairly. No filler, no fake discounts.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#deals"
              className="flex items-center gap-2 rounded-full bg-signal-orange px-6 py-3 text-sm font-semibold text-base-bg transition hover:bg-signal-amber"
            >
              Shop the deals <ArrowRight size={16} />
            </a>
            <a
              href="#categories"
              className="text-sm font-medium text-ink-muted hover:text-ink-primary"
            >
              Browse categories
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-sm rounded-2xl border border-base-border bg-base-surface p-6 shadow-2xl shadow-black/40">
            <div className="spec-strip mb-4 flex items-center justify-between text-xs text-signal-mint">
              <span>&#9679; IN STOCK</span>
              <span>SKU · TX-9021</span>
            </div>
            <div className="mb-4 aspect-square w-full rounded-xl bg-gradient-to-br from-base-surface2 to-base-bg" />
            <h3 className="font-display text-lg font-semibold">
              Nova X13, 256GB
            </h3>
            <p className="spec-strip mt-1 text-sm text-ink-muted">
              256GB · 5G · 108MP
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-signal-orange">
                KSh 42,999
              </span>
              <span className="text-sm text-ink-faint line-through">
                KSh 54,999
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
