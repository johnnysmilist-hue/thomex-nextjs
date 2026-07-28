import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const items = [
  { icon: Truck, label: "Nationwide delivery" },
  { icon: ShieldCheck, label: "Secure payment" },
  { icon: RotateCcw, label: "7-day returns" },
  { icon: Headset, label: "Support 7 days a week" },
];

export default function TrustStrip() {
  return (
    <section className="border-y border-base-border bg-base-surface/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-surface2 text-signal-orange">
              <Icon size={16} />
            </span>
            <span className="text-sm text-ink-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
