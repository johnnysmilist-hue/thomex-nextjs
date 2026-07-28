import { MessageCircle, Store, TrendingUp } from "lucide-react";

const miniLinks = [
  { icon: MessageCircle, label: "Chat to order", sub: "WhatsApp" },
  { icon: Store, label: "Sell on Thomex", sub: "Open a store" },
  { icon: TrendingUp, label: "Top brands", sub: "Verified only" },
];

export default function PromoPanel() {
  return (
    <div className="hidden w-56 shrink-0 flex-col gap-4 lg:flex">
      <div className="rounded-xl border border-base-border bg-base-surface p-3">
        {miniLinks.map(({ icon: Icon, label, sub }) => (
          <a
            key={label}
            href="#"
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-base-surface2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-base-surface2 text-signal-orange">
              <Icon size={15} />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-medium text-ink-primary">
                {label}
              </span>
              <span className="text-[11px] text-ink-faint">{sub}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between rounded-xl bg-gradient-to-br from-signal-orange to-signal-orangeDim p-5 text-base-bg">
        <span className="font-display text-lg font-bold leading-tight">
          Savings that spec check out
        </span>
        <a
          href="#deals"
          className="mt-4 w-fit rounded-full bg-base-bg px-4 py-2 text-xs font-semibold text-signal-orange"
        >
          Shop now
        </a>
      </div>
    </div>
  );
}
