import {
  BadgePercent,
  Sparkles,
  Zap,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { circleShortcuts } from "@/data/categories";

const iconMap: Record<string, LucideIcon> = {
  "badge-percent": BadgePercent,
  sparkles: Sparkles,
  zap: Zap,
  tag: Tag,
};

const accentMap: Record<string, string> = {
  orange: "bg-signal-orange text-base-bg",
  mint: "bg-signal-mint text-base-bg",
  amber: "bg-signal-amber text-base-bg",
};

export default function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="no-scrollbar -mx-4 grid grid-flow-col grid-rows-2 gap-x-6 gap-y-6 overflow-x-auto px-4 sm:mx-0 sm:grid-flow-row sm:grid-cols-6 sm:px-0 lg:grid-cols-6">
        {circleShortcuts.map((item) => (
          <a
            key={item.label}
            href="#"
            className="group flex w-20 flex-col items-center gap-2 text-center sm:w-auto"
          >
            {item.type === "photo" ? (
              <span
                className="h-16 w-16 rounded-full border border-base-border bg-cover bg-center transition group-hover:border-signal-orange/60 sm:h-20 sm:w-20"
                style={{ backgroundImage: `url(${item.image})` }}
              />
            ) : (
              (() => {
                const Icon = iconMap[item.icon];
                return (
                  <span
                    className={`flex h-16 w-16 flex-col items-center justify-center rounded-full text-center leading-tight sm:h-20 sm:w-20 ${accentMap[item.accent]}`}
                  >
                    <Icon size={18} />
                    <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">
                      {item.label}
                    </span>
                  </span>
                );
              })()
            )}
            <span className="text-xs text-ink-muted group-hover:text-ink-primary">
              {item.type === "photo" ? item.label : item.sublabel}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
