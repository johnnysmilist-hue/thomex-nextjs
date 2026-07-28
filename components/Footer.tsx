import { Zap } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: ["Phones", "Laptops", "Audio", "Wearables", "Deals"],
  },
  {
    title: "Help",
    links: ["Track order", "Shipping & delivery", "Returns", "Contact us"],
  },
  {
    title: "Thomex",
    links: ["About us", "Sell on Thomex", "Careers", "Terms & conditions"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-border bg-base-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-orange text-base-bg">
                <Zap size={16} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-bold">Thomex</span>
            </div>
            <p className="max-w-[20ch] text-sm text-ink-muted">
              Tech, picked by the spec.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-ink-primary">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-muted hover:text-signal-orange"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-base-border pt-6 text-xs text-ink-faint sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Thomex. All rights reserved.</span>
          <span>Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
