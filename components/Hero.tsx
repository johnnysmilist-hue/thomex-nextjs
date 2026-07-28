import { ArrowRight } from "lucide-react";
import Sidebar from "./Sidebar";
import PromoPanel from "./PromoPanel";

export default function Hero() {
  return (
    <section className="border-b border-base-border bg-circuit-fade">
      <div className="mx-auto flex max-w-7xl gap-4 px-4 py-6 sm:px-6">
        <Sidebar />

        <div
          className="relative flex flex-1 flex-col justify-end overflow-hidden rounded-xl border border-base-border bg-cover bg-center p-6 sm:p-10"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(10,14,23,0.92) 0%, rgba(10,14,23,0.55) 55%, rgba(10,14,23,0.15) 100%), url(https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop)",
            minHeight: "360px",
          }}
        >
          <span className="mb-3 w-fit rounded-full border border-signal-orange/40 bg-signal-orange/10 px-3 py-1 text-xs font-medium text-signal-orange">
            New drop · This week only
          </span>
          <h1 className="max-w-md font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
            Spec it. <span className="text-signal-orange">Ship it.</span>
          </h1>
          <p className="mt-2 max-w-sm text-sm text-ink-muted">
            Phones, laptops and audio gear — picked by the numbers that
            matter, starting from KSh 490.
          </p>
          <a
            href="#deals"
            className="mt-5 flex w-fit items-center gap-2 rounded-full bg-signal-orange px-5 py-2.5 text-sm font-semibold text-base-bg transition hover:bg-signal-amber"
          >
            Shop now <ArrowRight size={15} />
          </a>
        </div>

        <PromoPanel />
      </div>
    </section>
  );
}
